var projects = []

function newProject () {
  var projectName = prompt('Project name', '')
  var color = 'rgb(' + (76 + Math.round(Math.random() * 50 - 25)) + ', ' + (189 + Math.round(Math.random() * 50 - 25)) + ', ' + (255 - Math.round(Math.random() * 25)) + ')'
  if (projectName !== '' && projectName !== null) {
    var project = {name: projectName, color: color, open: false}
    projects.push(project)
    render()
  }
}

function render () {
  var target = document.getElementById('projects')
  target.innerHTML = ''
  if (projects.lenght !== 0) {
    projects.forEach(function (project) {
      var div = document.createElement('div')
      var h2 = document.createElement('h2')

      div.style.backgroundColor = project.color
      div.classList = 'project'
      h2.textContent = project.name

      div.appendChild(h2)
      target.appendChild(div)
    })
  } else {
    target.appendChild('')
  }
}
