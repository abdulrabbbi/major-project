/**
 * A higher-order function to handle asynchronous route handlers in Express.js
 * that automatically passes errors to the next middleware (error handler).
 * 
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} A wrapped function that catches errors and passes them to next().
 */
module.exports = (fn) => {
  return (req, res, next) => {
    // Wrap the async function and catch any errors, passing them to the error handler
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};

// module.exports = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
