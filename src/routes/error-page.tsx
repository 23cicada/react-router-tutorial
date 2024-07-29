import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  /**
   * 当 loader 或 action 抛出异常response时，response被解包（unwrap）为 ErrorResponse
   * throw new Response("", {
   *   status: 404,
   *   statusText: "Not Found",
   * });
   *
   * 可使用 json 工具简化（与上述示例相同）
   * import { json } from "react-router-dom";
   * throw json("", {
   *   status: 404,
   *   statusText: "Not Found",
   * });
   */
  const error = useRouteError();

  /**
   * 确定赋值断言：在实例属性和变量声明后放置!，
   * 向TypeScript传达变量确实已被赋值，即使TypeScript无法检测到。
   */
  let errorMessage!: string;

  if (!!!!isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>错误：Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
