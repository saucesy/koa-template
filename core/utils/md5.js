import crypto from "crypto";

/**
 * @param {String} value
 * @return {string}
 */
function md5(value) {
  return crypto.createHash("md5").update(value).digest("hex");
}

export default md5;
