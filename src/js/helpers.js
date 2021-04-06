import { TIMEOUT_SEC } from './config.js';

// reusable functions

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (error) {
    throw error;
  }
}

// export async function getJSON(url, id) {
//   try {
//     const res = await Promise.race([
//       fetch(`${url}/${id}`),
//       timeout(TIMEOUT_SEC),
//     ]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (error) {
//     //rethrow the error so it can be handled in the model.js --> to propagate the error down the invocation line
//     throw error;
//   }
// }

// export async function sendJSON(url, uploadData) {
//   try {
//     const res = await Promise.race([
//       fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(uploadData),
//       }),
//       timeout(TIMEOUT_SEC),
//     ]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (error) {
//     //rethrow the error so it can be handled in the controller --> to propagate the error down the invocation line
//     throw error;
//   }
// }
