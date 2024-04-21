import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IQuiz, IQuestion } from "../../client";
import * as client from "../../client";
import { Editor } from "@tinymce/tinymce-react";
import {
  addQuestion,
  deleteQuestion,
  updateQuestion,
  setQuestion,
  setQuestions,
} from "../QuizReducer";
import { KanbasState } from "../../../../store";

export default function QuizEditor({
  quizData,
  setParentQuiz,
}: {
  quizData: IQuiz;
  setParentQuiz: any;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseId, qid } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const questions = useSelector(
    (state: KanbasState) => state.questionsReducer.questions
  );
  const selectedQuestion = useSelector(
    (state: KanbasState) => state.questionsReducer.question
  );

  useEffect(() => {
    if (quizData._id && quizData._id !== 'new') {
      client.findQuestionsByQuizId(quizData._id)
        .then((questions: IQuestion[]) => dispatch(setQuestions(questions)))
        .catch(error => console.error("Failed to fetch questions for quiz:", error));
    }
  }, [quizData, dispatch]);

  const handleSave = async () => {
    if (!quizData._id || quizData._id === 'new') {
        // Create a new quiz
        client.createQuiz(courseId, {...quizData, _id: undefined}).then(quiz => {
            setParentQuiz(quiz);
            navigate(`/Kanbas/Courses/${courseId}/Quizzes`, { replace: true });
        }).catch(error => {
            console.error("Failed to create new quiz:", error);
            alert("Failed to create new quiz.");
        });
    } else {
        // Update existing quiz
        client.updateQuiz(quizData).then(() => {
            setParentQuiz(quizData);
            navigate(`/Kanbas/Courses/${courseId}/Quizzes`, { replace: true });
        }).catch(error => {
            console.error("Failed to update quiz:", error);
            alert("Failed to update quiz.");
        });
    }
  };

  const handleSaveAndPublish = async () => {
    try {
        await handleSave();
        const updatedQuiz = { ...quizData, published: true };

        await client.updateQuiz(updatedQuiz);
        setParentQuiz(prevQuizzes =>
            prevQuizzes.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q))
        );
        navigate(`/Kanbas/Courses/${courseId}/Quizzes`, { replace: true });
    } catch (error) {
        console.error("Failed to save or publish quiz:", error);
        alert("Failed to save or publish quiz.");
    }
};

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${courseId}/Quizzes`, { replace: true });
  };

  // handle new question creation
  const handleNewQuestion = async () => {
    const newQuestion = {
      quizId: quizData._id,
      questionType: "MULTI",
      title: "New Question",
      points: 0,
      question: "",
      choices: [],
      correctAnswerIndex: 0,
    };

    client.createQuestion(newQuestion).then((question) => {
      dispatch(setQuestions([...questions, question]));
    });
  };

  // handle update questions
  const handleUpdateQuestion = async (question: IQuestion) => {
    dispatch(setQuestion(question));
    navigate(`/Kanbas/Courses/${courseId}/Quizzes/${qid}/${question._id}/Edit`);
  };

  // handle preview
  const handlePreview = () => {
    navigate(`/Kanbas/Courses/${courseId}/Quizzes/${qid}/preview`);
  };

  return (
    <div
      className="overflow-y-scroll position-fixed bottom-0 end-0"
      style={{ left: "320px", top: "250px" }}
    >
      <h2>Quiz Editor</h2>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Quiz Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Quiz Questions
          </button>
        </li>
      </ul>
      {activeTab === "details" && (
        <form>
          <div className="form-group">
            <label htmlFor="quizTitle">Quiz Title</label>
            <input
              type="text"
              className="form-control"
              id="quizTitle"
              placeholder="Enter quiz title"
              value={quizData.title}
              onChange={(e) =>
                setParentQuiz({ ...quizData, title: e.target.value })
              }
            />
            <label htmlFor="quizDescription">Quiz Instructions: </label>
            <Editor
              apiKey="sopryxtxccca7va4j5jmvjw0zxswou9koakxuxxlcd0y90h7"
              initialValue={quizData.description}
              init={{
                height: 200,
                width: 500,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
              }}
              onEditorChange={(content) => setParentQuiz({...quizData, description: content})}
            />
          </div>
          <div className="form-group">
            <label htmlFor="selectQuizType">Quiz Type</label>
            <select
              id="selectQuizType"
              className="form-control"
              value={quizData.quizType}
              onChange={(e) =>
                setParentQuiz({ ...quizData, quizType: e.target.value })
              }
            >
              <option value="Graded Quiz">Graded Quiz</option>
              <option value="Practice Quiz">Practice Quiz</option>
              <option value="Graded Survey">Graded Survey</option>
              <option value="Ungraded Survey">Ungraded Survey</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quizPoints">Points</label>
            <input
              type="number"
              className="form-control"
              id="quizPoints"
              placeholder="0"
              value={quizData.points}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  points: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="selectAssignmentGroup">Assignment Group</label>
            <select
              id="selectAssignmentGroup"
              className="form-control"
              value={quizData.assignmentGroup}
              onChange={(e) =>
                setParentQuiz({ ...quizData, assignmentGroup: e.target.value })
              }
            >
              <option value="Quizzes">Quizzes</option>
              <option value="Exams">Exams</option>
              <option value="Assignments">Assignments</option>
              <option value="Projects">Projects</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="shuffleAnswersCheck"
              checked={quizData.shuffleAnswers}
              onChange={(e) =>
                setParentQuiz({ ...quizData, shuffleAnswers: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="shuffleAnswersCheck">
              Shuffle Answers?
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="quizTime">Time Limit (Minutes)</label>
            <input
              type="number"
              className="form-control"
              id="quizTime"
              placeholder="0"
              value={quizData.timeLimit}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  timeLimit: parseInt(e.target.value) || -1,
                })
              }
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="multipleAttemptsCheck"
              checked={quizData.multipleAttempts}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  multipleAttempts: e.target.checked,
                })
              }
            />
            <label className="form-check-label" htmlFor="multipleAttemptsCheck">
              Multiple Attempts?
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="showCorrectCheck"
              checked={quizData.showCorrectAnswers}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  showCorrectAnswers: e.target.checked,
                })
              }
            />
            <label className="form-check-label" htmlFor="showCorrectCheck">
              Show Correct Answers?
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="accessCode">Access Code</label>
            <input
              type="text"
              className="form-control"
              id="accessCode"
              placeholder="(Optional) Enter access code"
              value={quizData.accessCode}
              onChange={(e) =>
                setParentQuiz({ ...quizData, accessCode: e.target.value })
              }
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="oneQuestionCheck"
              checked={quizData.oneQuestionAtATime}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  oneQuestionAtATime: e.target.checked,
                })
              }
            />
            <label className="form-check-label" htmlFor="oneQuestionCheck">
              One Question at a Time?
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="webcamRequiredCheck"
              checked={quizData.webcamRequired}
              onChange={(e) =>
                setParentQuiz({ ...quizData, webcamRequired: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="webcamRequiredCheck">
              Webcam Required?
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="lockQuestionCheck"
              checked={quizData.lockQuestionsAfterAnswering}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  lockQuestionsAfterAnswering: e.target.checked,
                })
              }
            />
            <label className="form-check-label" htmlFor="lockQuestionCheck">
              Lock Questions after Answering?
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              value={new Date(quizData.dueDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  dueDate: new Date(e.target.value),
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="availableDate">Available Date</label>
            <input
              type="date"
              className="form-control"
              id="availableDate"
              value={
                new Date(quizData.availableDate).toISOString().split("T")[0]
              }
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  availableDate: new Date(e.target.value),
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="untilDate">Until Date</label>
            <input
              type="date"
              className="form-control"
              id="untilDate"
              value={new Date(quizData.untilDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setParentQuiz({
                  ...quizData,
                  untilDate: new Date(e.target.value),
                })
              }
            />
          </div>
        </form>
      )}
      {activeTab === "questions" && (
        <div>
          <button className="btn btn-primary" onClick={handleNewQuestion}>
            New Question
          </button>
          <div className="container">
            <ul className="list-group">
              {questions.map((question) => (
                <li
                  className="list-group-item"
                  key={question._id}
                  onClick={() => dispatch(setQuestion(question))}
                >
                  <div className="container">
                    <div className="row">
                      <div className="col">{question._id}</div>
                    </div>
                    <div className="row form-group">
                      <label htmlFor="quizTitle">Quiz Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="quizTitle"
                        placeholder="Enter quiz title"
                        value={question.title}
                        readOnly
                      />
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleUpdateQuestion(question)}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <br />
      <button className="btn btn-success" style={{marginRight:10}} onClick={handleSave}>
        Save
      </button>
      <button className="btn btn-secondary"style={{marginRight:10}}  onClick={handleSaveAndPublish}>
        Save & Publish
      </button>
      <button className="btn btn-danger" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}