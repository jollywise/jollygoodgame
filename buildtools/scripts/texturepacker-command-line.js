'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

let exec = (exports.exec = (() => {
  var _ref = _asyncToGenerator(function*(path, opts) {
    let command = buildCommand(path, opts);

    return yield execProcess(command)
      .then(function(output) {
        if (output && output.stdout) {
          console.log(output.stdout);
        }

        if (output && output.stderr) {
          console.error(output.stderr);
        }
      })
      .catch(function(err) {
        if (err) {
          console.error(err);
        }
      });
  });

  return function exec(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

exports.buildCommand = buildCommand;

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            }
          );
        }
      }
      return step('next');
    });
  };
}

const util = require('util');
const execProcess = util.promisify(require('child_process').exec);

function buildCommand(path, opts) {
  opts = opts || {};

  let command = new Command();
  command.addPath(path);
  Object.keys(opts).forEach((option) => {
    command.addOption(option, opts[option]);
  });

  return command.build();
}

class Command {
  constructor() {
    this.commands = [];
    this.path = '';
  }

  addPath(path) {
    this.path = path;
  }

  addOption(option, value) {
    this.commands.push({
      option: `--${this.kebabCase(option)}`,
      value,
    });
  }

  build() {
    if (!this.path) throw new Error('Must specify a path to process (image/directory)');

    let options = this.commands.map((c) => `${c.option}${this.resolveValue(c.value)}`).join(' ');
    return `TexturePacker ${this.path} ${options}`;
  }

  resolveValue(value) {
    if (value === true) {
      return '';
    }

    return ` ${value}`;
  }

  // https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
  kebabCase(text) {
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
