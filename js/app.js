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

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

function findProject (projectName) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].name === projectName) {
      return i
    }
  }
  return false
}

function newProject () {
  var projectName = prompt('Project name', '')
  var color = 'rgb(' + (76 + Math.round(Math.random() * 50 - 25)) + ', ' + (189 + Math.round(Math.random() * 50 - 25)) + ', ' + (255 - Math.round(Math.random() * 25)) + ')'
  if (projectName !== '' && projectName !== null && findProject(projectName) === false) {
    var project = {name: projectName, color: color, expanded: false, activities: [], activityIndex: 0}
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
  projects.splice(findProject(project), 1)
  editToggle()
  storageWrite()
  render()
}

function expand (project) {
  var wrapper = document.getElementById(project)
  var content = document.getElementById('content' + project)

  var height = window.getComputedStyle(wrapper).getPropertyValue('height')
  wrapper.style.height = height

  if (wrapper.clientHeight === 89) {
    var computedHeight = content.clientHeight + 89
    wrapper.style.height = computedHeight + 'px'
    projects[findProject(project)].expanded = true
  } else {
    wrapper.style.height = '89px'
    projects[findProject(project)].expanded = false
  }
  storageWrite()
}

function addActivity (project) {
  var input = document.getElementById('input' + project)
  var name = input.value
  var activity = {name: name, completion: false, id: guid()}
  projects[findProject(project)].activities.push(activity)
  input.value = ''
  storageWrite()
  render()
}

function activityCompletion (project, index) {
  var lastIndex = projects[findProject(project)].activityIndex
  var delayTime = 0
  projects[findProject(project)].activityIndex = index

  for (var i = 0; i < projects[findProject(project)].activities.length; i++) {
    var clearElement = document.getElementById(projects[findProject(project)].activities[i].id)
    if (index < lastIndex) {
      if (i+1 >= index) {
        delayTime = 0.15*(lastIndex-i-1)
      }
      clearElement.style.transitionDelay = delayTime + 's'
      clearElement.parentNode.style.transitionDelay = delayTime + 's'
    }
    clearElement.style.height = 0
    clearElement.parentNode.style.backgroundColor = 'rgba(0,0,0,0)'
  }

  delayTime = 0

  for (i = 0; i < index-1; i++) {
    var element = document.getElementById(projects[findProject(project)].activities[i].id)
    if (index > lastIndex) {
      if (i >= lastIndex) {
        delayTime = delayTime + 0.15
      }
      element.style.transitionDelay = delayTime + 's'
      element.parentNode.style.transitionDelay = delayTime + 's'
    }

    element.style.height = '100%'
    element.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 1)'
  }
  var lastDot = document.getElementById(projects[findProject(project)].activities[i].id)
  lastDot.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 1)'
  if (index === 1 && lastIndex === 1) {
    projects[findProject(project)].activityIndex = 0
    lastDot.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 0)'
  }
  lastDot.parentNode.style.transitionDelay = 0 + 's'
  storageWrite()
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
      if (projects[findProject(project.name)].expanded) {
        div.style.height = 'auto'
      }

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

      for (let i = 0; i < projects[findProject(project.name)].activities.length; i++) {
        var activity = document.createElement('div')
        var dot = document.createElement('div')
        var line = document.createElement('div')
        var activitytext = document.createElement('h3')

        activity.classList = 'activity'
        activity.addEventListener('click', function () {
          activityCompletion(project.name, i+1)
        })
        activitytext.textContent = projects[findProject(project.name)].activities[i].name
        line.setAttribute('id', projects[findProject(project.name)].activities[i].id)
        line.classList = 'line'
        if (projects[findProject(project.name)].activityIndex-1 > i) {
          line.style.height = '100%'
          dot.style.backgroundColor = 'rgba(255, 255, 255, 1)'
        } else if (projects[findProject(project.name)].activityIndex-1 === i) {
          dot.style.backgroundColor = 'rgba(255, 255, 255, 1)'
        }

        if (projects[findProject(project.name)].activityIndex === 0) {
          dot.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        }
        dot.appendChild(line)
        activity.appendChild(dot)
        activity.appendChild(activitytext)
        content.appendChild(activity)
      }

      input.setAttribute('id', 'input' + project.name)

      button.textContent = 'New activity'
      button.addEventListener('click', function () {
        addActivity(project.name)
      })

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
