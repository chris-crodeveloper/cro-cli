#!/usr/bin/env node

const inquirer = require('inquirer')
const program = require('commander')
const ora = require('ora')
const download = require('download-git-repo')
const templateList = require(`${__dirname}/../template`)
const symbols = require('log-symbols')
const chalk = require('chalk')
const cliSelect = require('cli-select');
 
chalk.level = 1

// console.log(templateList)
const listString = JSON.stringify(templateList)
const list = JSON.parse(listString)

let testName;

let question = 
  {
    name: "testName",
    type: 'input',
    message: "CRO Test name",
    validate (val) {
      if (!val) {
        return 'Name is required!'
      } else if (templateList[val]) {
        return 'Template has already existed!'
      } else {
        return true
      }
    }
  }

  inquirer
  .prompt(question).then(answers => {
     testName = answers.testName;

     cliSelect({
      values: list, 
      valueRenderer: (value, selected) => {
        if (selected) {
            return chalk.underline(value);
        }
    
        return value;
      },
    }).then((value) => {
      if (value !== null) {
        console.log('value ' + value.value);
        console.log('value ' + value.id);
    
        program
          .usage('[project-name]')
        program.parse(process.argv)
        if (program.args.length > 1) return program.help()
    
        // Project name and template name
        let templateUrl = value.value
    
        if (!testName) {
          console.log(chalk.red('\n Project should not be empty! \n '))
          return
        }
    
    
        console.log(chalk.green('\n Start generating... \n'))
        // 出现加载图标
        const spinner = ora("Downloading...");
        spinner.start();
    
        download(
          `direct:${templateUrl}`,
          `./${testName}`,
          { clone: true },
          err => {
            if (err) {
              spinner.fail();
              console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
              return
            }
            // 结束加载图标
            spinner.succeed();
            console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
            console.log('\n To get started')
            console.log(`\n    cd ${testName} \n`)
          }
        )
      } 
    });
  })


