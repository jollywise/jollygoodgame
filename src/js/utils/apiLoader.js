export const LoadAPIData = (url, onComplete, onError) => {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = (e) => {
    const request = e.currentTarget;
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.response);

      if (onComplete) {
        onComplete(data.result);
      }
    } else if (onError) {
      onError(e);
    }
  };
  request.send();
};
