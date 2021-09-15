#!/usr/bin/env node

const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const templateList = require(`${__dirname}/../template`)
const { showTable } = require(`${__dirname}/../util/showTable`)

let question = [
  {
    name: "name",
    message: "请输入要删除的模板名称",
    validate (val) {
      if (!val) {
        return 'Name is required!'
      } else if (!templateList[val]) {
        return 'Template does not exist!'
      } else {
        return true
      }
    }
  }
]

inquirer
  .prompt(question).then(answers => {
    let { name } = answers;
    delete templateList[name]
    fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(templateList), 'utf-8', err => {
      if (err) console.log(err)
      console.log(chalk.green('Deleted successfully!\n'))
      console.log(chalk.grey('The latest template list is: \n'))
      showTable(templateList)
    })
  })
