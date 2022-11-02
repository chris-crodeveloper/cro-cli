#!/usr/bin/env node

const inquirer = require('inquirer')
const fs = require('fs')
const croconfig = require(`${__dirname}/../croconfig`)
const { showTable } = require(`${__dirname}/../util/showTable`)
const symbols = require('log-symbols')
const chalk = require('chalk')
chalk.level = 1

let question = 
  {
    name: "url",
    type: 'input',
    message: "URL for CRO GITHUB Repo:",
    validate (val) {
      if (!val) {
        return 'Url is required!'
      }  else {
        return true
      }
    }
  }


inquirer
  .prompt(question).then(answer => {
    let { url } = answer;
    croconfig['repo'] = url.replace(/[\u0000-\u0019]/g, '') 
    fs.writeFile(`${__dirname}/../croconfig.json`, JSON.stringify(croconfig), 'utf-8', err => {
      if (err) console.log(chalk.red(symbols.error), chalk.red(err))
      console.log('\n')
      console.log(chalk.green(symbols.success), chalk.green('GITHUB Repo updated!\n'))
      console.log(chalk.green('The repository is: \n'))
      showTable(croconfig)
    })
  })
