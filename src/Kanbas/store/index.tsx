import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "../Courses/Modules/modulesReducer";
import assignmentsReducer from "../Courses/Assignments/assignmentsReducer";
import questionsReducer from "../Courses/Quizzes/Quiz/QuizReducer";

export interface KanbasState {
  modulesReducer: {
    modules: any[];
    module: any;
  };
  assignmentsReducer: {
    assignments: any[];
    assignment: any;
  };
  questionsReducer: {
    questions: any[];
    question: any;
  };
}

const store = configureStore({
  reducer: {
    modulesReducer,
    assignmentsReducer,
    questionsReducer
  },
});

export default store;
