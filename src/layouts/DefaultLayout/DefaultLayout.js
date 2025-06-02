import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import clsx from "clsx";
import styles from "./DefaultLayout.module.scss";
import PropTypes from "prop-types";

import AuthModal from "~/components/AuthModal";
import { selectOpenform } from "~/store/features/formAuthSlice";

import { useDispatch, useSelector } from "react-redux";

import {
  selectIsOpenVideoDetail,
  setIsOpenVideoDetail,
} from "~/store/features/videoDetailSlice";
import { createPortal } from "react-dom";

import { useEffect } from "react";
import VideoDetail from "~/pages/VideoDetail";

export default function DefaultLayout({ children, isFullWidth = true }) {
  const isOpen = useSelector(selectOpenform);
  const dispatch = useDispatch();
  const isOpenVideoDetail = useSelector(selectIsOpenVideoDetail);
  useEffect(() => {
    if (isOpenVideoDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "overlay";
    }
  }, [isOpenVideoDetail]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpenVideoDetail) {
        dispatch(setIsOpenVideoDetail(false));
        // Restore previous URL when closing with ESC
        if (
          window.history.state?.fromModal &&
          window.history.state?.previousUrl
        ) {
          window.history.pushState(null, "", window.history.state.previousUrl);
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpenVideoDetail, dispatch]);

  useEffect(() => {
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;
      const isVideoDetailURL = currentPath.startsWith("/video/");

      if (isVideoDetailURL && !isOpenVideoDetail) {
        // If we're navigating to a video detail URL but modal is not open
        // This case is handled by the router
      } else if (!isVideoDetailURL && isOpenVideoDetail) {
        // If we're navigating away from video detail URL and modal is open
        dispatch(setIsOpenVideoDetail(false));
      } else if (isVideoDetailURL && isOpenVideoDetail) {
        // If we're in modal and user clicks back button
        // Prevent default navigation and close modal
        event.preventDefault();
        dispatch(setIsOpenVideoDetail(false));

        // If we have a previous URL in state, go back to it
        if (
          window.history.state?.fromModal &&
          window.history.state?.previousUrl
        ) {
          window.history.pushState(null, "", window.history.state.previousUrl);
        } else {
          // If no previous URL, go back one more step
          window.history.back();
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpenVideoDetail, dispatch]);
  return (
    <div className={clsx(styles.wrapper)}>
      {isOpenVideoDetail &&
        createPortal(
          <VideoDetail isModal={true} />,
          document.getElementById("modal-root")
        )}
      <Header isFullWidth={isFullWidth} />
      <div className={clsx(styles.container, { "full-width": isFullWidth })}>
        <Sidebar />
        <div className={clsx(styles.content)}>{children}</div>
      </div>
      <AuthModal isOpen={isOpen} />
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isFullWidth: PropTypes.bool,
};
