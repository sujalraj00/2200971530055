
const axios = require('axios');

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const COMMON_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

function isValid(value, list) {
  return list.includes(value);
}

async function Log(stack, level, pkg, message) {
  try {
    if (!isValid(stack, VALID_STACKS)) throw new Error(`Invalid stack: ${stack}`);
    if (!isValid(level, VALID_LEVELS)) throw new Error(`Invalid level: ${level}`);

    const allowedPackages =
      stack === 'backend'
        ? [...BACKEND_PACKAGES, ...COMMON_PACKAGES]
        : [...FRONTEND_PACKAGES, ...COMMON_PACKAGES];

    if (!isValid(pkg, allowedPackages)) {
      throw new Error(`Invalid package: ${pkg} for stack: ${stack}`);
    }

    const response = await axios.post('http://20.244.56.144/evaluation-service/logs', {
      stack,
      level,
      package: pkg,
      message,
    });

    if (response.status === 200) {
      console.log(`✅ Log Created: ${response.data.logID}`);
    } else {
      console.error(`Logging failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Logger Error: ${error.message}`);
  }
}

module.exports = { Log };
