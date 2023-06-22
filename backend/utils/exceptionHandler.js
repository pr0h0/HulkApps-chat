const filler = new Array(50).fill("-").join("");
const startFiller = `${filler}\n`;
const endFiller = `\n${filler}`;

async function handleException(type, error) {
  const msg = `${startFiller}${new Date().toISOString()} ${type} \n Message: ${
    error.message
  } \n ${error.stack}${endFiller}`;
  console.error(msg);
}

function exceptionHandler() {
  process.on("uncaughtException", (err) =>
    handleException("uncaughtException", err)
  );

  process.on("unhandledRejection", (err) =>
    handleException("unhandledRejection", err)
  );
}

module.exports = exceptionHandler;
