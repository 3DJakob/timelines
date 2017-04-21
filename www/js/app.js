var projects = []
var edit = false

function newProject () {
  var projectName = prompt('Project name', '')
  var color = 'rgb(' + (76 + Math.round(Math.random() * 50 - 25)) + ', ' + (189 + Math.round(Math.random() * 50 - 25)) + ', ' + (255 - Math.round(Math.random() * 25)) + ')'
  if (projectName !== '' && projectName !== null) {
    var project = {name: projectName, color: color, height: 0}
    projects.push(project)
    render()
  }
}

function editToggle () {
  edit = !edit
  var elements = document.getElementsByClassName('deleteBtn')
  if (edit === true) {
    document.getElementsByTagName('body')[0].className = 'editmode'
  } else {
    document.getElementsByTagName('body')[0].className = 'standard'
  }
}

function expand (project) {
  var element = document.getElementById(project)
  var style = window.getComputedStyle(element)
  var height = style.getPropertyValue('height')
  if (height === '0px') {
    element.style.maxHeight = '100vh'
  } else {
    element.style.maxHeight = '0'
  }
}

function render () {
  var target = document.getElementById('projects')
  target.innerHTML = ''
  if (projects.lenght !== 0) {
    projects.forEach(function (project) {
      var div = document.createElement('div')
      var row = document.createElement('div')
      var h2 = document.createElement('h2')
      var remove = document.createElement('button')
      var content = document.createElement('div')
      var input = document.createElement('input')
      var button = document.createElement('button')

      h2.addEventListener('click', function () {
        expand(project.name)
      })
      div.style.backgroundColor = project.color
      div.classList = 'project'
      h2.textContent = project.name + ' ▿'
      row.classList = 'row'
      remove.textContent = 'Delete'
      button.textContent = 'New activity'
      content.setAttribute('id', project.name)
      content.style.maxHeight = '0'

      row.appendChild(h2)
      row.appendChild(remove)
      div.appendChild(row)
      content.appendChild(input)
      content.appendChild(button)
      div.appendChild(content)
      target.appendChild(div)
    })
  } else {
    target.appendChild('')
  }
}
