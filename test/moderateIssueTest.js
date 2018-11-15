var sinon = require("sinon");
var proxyquire = require("proxyquire");
var issueOpenedPayload = require("./fixtures/issue-opened.json");

describe("ModerateIssue", function() {
  var moderateIssue;

  before(function() {
    createCommentStub = sinon.spy();
    addLabelsStub = sinon.spy();
    octoKitStubs = {
      issues: {
        addLabels: addLabelsStub,
        createComment: createCommentStub
      }
    };

    moderateIssue = proxyquire("../ModerateIssue/index", {
      "@octokit/rest": () => octoKitStubs,
      "./authenticate": () => true,
      "./get-luis-intent": () => "question"
    });
  });

  it('should assign the enhancement label', async () => {
    await moderateIssue({}, { body: issueOpenedPayload })

    sinon.assert.calledWith(addLabelsStub, {
      labels: ['enhancement', 'question', 'bug'],
    });
  });
});
