/* eslint-disable no-undef */
import { message, danger, fail } from 'danger';

const owner = process.env.CIRCLE_PROJECT_USERNAME;
const repoName = process.env.CIRCLE_PROJECT_REPONAME;
const username = process.env.CIRCLE_USERNAME;
const fails = [];
const validBranchName = /^(feature|bugfix|refactor|hotfix|fix)(\/|-).*$/g;
const validGithubIssue = /issue #[0-9]{1,5}/gm;
const validJSFile = /\.js$/g;
const validComent = /\/\*\*.*(function)?.*\*\/\n(async )?function/s;
const leng = danger.github.commits.length;
const lastCommit = danger.github.commits[leng - 1];
// const reviewersCount = danger.github.requested_reviewers.users.length

/**
 * Function that prints the fails in the PR
 * @param {array} fails - Array with the list of fails
 */
async function finalJudgment(fails) {
  const leng = fails.length;

  let msg = '';
  if (leng > 0) {
    msg = fails.reduce((current, next, index) => {
      if (index === leng - 1) {
        return `${current} ${next}`;
      } else {
        return `${current} ${next},`;
      }
    },'Jules, ¿has oído la filosofía de que cuando un hombre admite que se ha equivocado de inmediato se le perdonan todos sus pecados? ¿Habías oído eso?: ');
    fail(msg);
  } else {
    message(
      `Joder ${username}, este codigo es una pasada tío, Vincent y yo nos hubiéramos conformado con cualquier codigo de Stack Overflow verdad? y va y nos saca este auténtico codigo de gourmet sin dudarlo.`,
    );
  }
}

/**
 * Function that check if the live documentation exist
 * @param {array} modifiedFiles - Array with the list of modified files
 */
async function checkLiveDocumentation(modifiedFiles) {
  let diffFile;
  let currentContent;

  for (const file of modifiedFiles) {
    if (file.indexOf('dangerfile') < 0 && file.match(validJSFile)) {
      diffFile = await danger.git.diffForFile(file);
      currentContent = diffFile.after;

      if (
        currentContent.indexOf('function') > -1 &&
        !currentContent.match(validComent)
      ) {
        fails.push(
          `Hey! The file ${file} has a function but it doesn't have a live documentation. It is not admisible`,
        );
      }
    }
  }
}

/**
 * Function that checks the branch name
 * @param {response} response - Object with the response from
 */
async function checkBranch(response) {
  const branches = response.data;
  const branch = branches[branches.length - 1];

  if (!validBranchName.test(branch.name)) {
    fails.push(
      'Esta rama tiene un nombre que no sigue las normas, siguiente',
    );
  }
}

message(`
Hola, soy el Señor Lobo. Soluciono problemas.
`);

/* if (reviewersCount <= 0) {
  fails.push('The pull request must have, at least, one reviewer');
} */

if (danger.github.pr.body.length === 0) {
  fails.push(
    'Has mandado el Pull Request vacio, ¿qué quieres conseguir con este request?',
  );
}

if (!validGithubIssue.test(danger.github.pr.body)) {
  fails.push(
    'Este pull request no está asociado a ningún issue. Estás trabajando en algo importante?',
  );
}

danger.github.api
  .request(
    `/repos/${owner}/${repoName}/commits/${lastCommit.sha}/branches-where-head`,
    {
      headers: {
        accept: 'application/vnd.github.groot-preview+json',
      },
    },
  )
  .then(response => checkBranch(response))
  .then(() => checkLiveDocumentation(danger.git.modified_files))
  .then(() => {
    finalJudgment(fails);
  })
  .catch(error => {
    throw error;
  });
