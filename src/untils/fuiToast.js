export const FuiToast = (
  type,
  message,
  options = {},
) => {
  if (window.FuiToast && typeof window.FuiToast[type] === "function") {
    window.FuiToast[type](message, options);
  } else {
    console.error(
      `FuiToast is not available or type "${type}" is not supported.`
    );
  }
};
