import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaEllipsisV,
  FaPlusCircle,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { KanbasState } from "../../store";
import { deleteAssignment, setAssignments, setAssignment } from "./assignmentsReducer";
import * as client from "./client";

function Assignments() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    client
      .findAssignmentsForCourse(courseId)
      .then((modules) => dispatch(setAssignments(modules)));
  }, [courseId, dispatch]);
  const navigate = useNavigate();
  const assignmentList = useSelector(
    (state: KanbasState) => state.assignmentsReducer.assignments
  );
  const assignment = useSelector(
    (state: KanbasState) => state.assignmentsReducer.assignment
  );
  const handleAddAssignmentClick = () => {
    navigate(`/Kanbas/Courses/${courseId}/Assignments/new`);
  };
  const handleDelete = (assignmentId: string) => {
    const isConfirmed = window.confirm("Delete?");
    if (isConfirmed) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  return (
    <>
      <div
        className="overflow-y-scroll position-fixed bottom-0 end-0"
        style={{ left: "320px", top: "250px" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <form className="form-inline">
            <input
              id="text-fields-SA"
              className="form-control"
              placeholder="Search Assignment"
            />
          </form>

          <div className="float-end">
            <button className="btn btn-outline-success me-2">
              <i className="fas fa-users"></i> Group
            </button>
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleAddAssignmentClick}
            >
              <FaPlusCircle /> Assignment
            </button>
            <button className="btn btn-outline-primary me-2"> ︙</button>
          </div>
        </div>
        <ul className="list-group wd-modules">
          <li className="list-group-item">
            <div>
              <FaEllipsisV className="me-2" /> ASSIGNMENTS
              <span className="float-end">
                <FaCheckCircle className="text-success" />
                <FaPlusCircle className="ms-2" />
                <FaEllipsisV className="ms-2" />
              </span>
            </div>
            <ul className="list-group">
              {assignmentList
                .filter((assignment) => assignment.course == courseId)
                .map((assignment, index) => (
                  <li className="list-group-item" key={index}>
                    <FaEllipsisV className="me-2" />
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      onClick={() => dispatch(setAssignment(assignment))}
                      to={`/Kanbas/Courses/${courseId}/Assignments/${assignment._id}`}
                    >
                      {assignment.title}
                    </Link>
                    <span className="float-end">
                      <button
                        className="btn btn-danger btn-sm mx-2"
                        onClick={() => handleDelete(assignment._id)}
                      >
                        Delete
                      </button>
                      <FaCheckCircle className="text-success" />
                      <FaEllipsisV className="ms-2" />
                    </span>
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Assignments;
