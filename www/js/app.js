var projects = []
var edit = false

function storageWrite () {
  var projectsStorage = JSON.stringify(projects)
  localStorage.setItem('projects', projectsStorage)
}

function storageRead () {
  projects = JSON.parse(localStorage.getItem('projects'))
  if (projects === null) {
    projects = []
  }
  storageWrite()
  render()
}

function newProject () {
  var projectName = prompt('Project name', '')
  var color = 'rgb(' + (76 + Math.round(Math.random() * 50 - 25)) + ', ' + (189 + Math.round(Math.random() * 50 - 25)) + ', ' + (255 - Math.round(Math.random() * 25)) + ')'
  if (projectName !== '' && projectName !== null) {
    var project = {name: projectName, color: color, height: 0}
    projects.push(project)
    storageWrite()
    render()
  }
}

function editToggle () {
  edit = !edit
  if (edit === true) {
    document.getElementsByTagName('body')[0].className = 'editmode'
  } else {
    document.getElementsByTagName('body')[0].className = 'standard'
  }
}

function deleteProject (project) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].name === project) {
      projects.splice(i, 1)
      editToggle()
      storageWrite()
      render()
    }
  }
}

function expand (project) {
  var wrapper = document.getElementById(project)
  var content = document.getElementById('content' + project)

  if (wrapper.clientHeight === 89) {
    var computedHeight = content.clientHeight + 89
    wrapper.style.height = computedHeight + 'px'
  } else {
    wrapper.style.height = '89px'
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

      div.style.backgroundColor = project.color
      div.classList = 'project'

      div.setAttribute('id', project.name)

      h2.textContent = project.name + ' ▿'
      h2.addEventListener('click', function () {
        expand(project.name)
      })

      row.classList = 'row'

      remove.textContent = 'Delete'
      remove.addEventListener('click', function () {
        deleteProject(project.name)
      })

      button.textContent = 'New activity'

      content.setAttribute('id', 'content' + project.name)

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
