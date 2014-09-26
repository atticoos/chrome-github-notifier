var Promise = require('bluebird'),
    request = Promise.promisify(require('request')),
    host = 'https://api.github.com/';

module.exports = {
  validate: function (token, repositoryID) {
    var options;
    repositoryID = repositoryID.substring(1, repositoryID.length);
    options = {
      url: host + 'repositories/' + repositoryID,
      headers: {
        Authorization: 'token ' + token,
        'User-Agent': 'Chrome-Github-Notifier-App'
      }
    };
    return request(options).spread(function (response) {
      if (response.statusCode > 299) {
        throw new Error('Unauthorized Request');
      }
    });
  }
}
