var projects = []
var edit = false
var moreOpen = 'none'

function storageWrite () {
  var projectsStorage = JSON.stringify(projects)
  localStorage.setItem('projects', projectsStorage)
  localStorage.setItem('moreOpen', moreOpen)
}

function storageRead () {
  moreOpen = localStorage.getItem('moreOpen')
  if (moreOpen === null) {
    moreOpen = 'none'
  }
  projects = JSON.parse(localStorage.getItem('projects'))
  if (projects === null) {
    projects = []
  }
  storageWrite()
  render()
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

function findProject (id) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      return i
    }
  }
  return false
}

function findActivity (projectId, activityId) {
  for (var i = 0; i < projects[findProject(projectId)].activities.length; i++) {
    if (projects[findProject(projectId)].activities[i].id === activityId) {
      return i
    }
  }
  return false
}

function newProject () {
  var projectName = prompt('Project name', '')
  var color = 'rgb(' + (76 + Math.round(Math.random() * 50 - 25)) + ', ' + (189 + Math.round(Math.random() * 50 - 25)) + ', ' + (255 - Math.round(Math.random() * 25)) + ')'
  if (projectName !== '' && projectName !== null) {
    var project = {id: guid(), name: projectName, color: color, expanded: false, activities: [], activityIndex: 0, notes: ''}
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

function deleteProject (id) {
  projects.splice(findProject(id), 1)
  editToggle()
  storageWrite()
  render()
}

function expand (id) {
  var wrapper = document.getElementById(id)
  var content = document.getElementById('content' + id)

  var height = window.getComputedStyle(wrapper).getPropertyValue('height')
  wrapper.style.height = height

  if (wrapper.clientHeight === 89) {
    var computedHeight = content.clientHeight + 89
    wrapper.style.height = computedHeight + 'px'
    projects[findProject(id)].expanded = true
  } else {
    wrapper.style.height = '89px'
    projects[findProject(id)].expanded = false
  }
  storageWrite()
}

function addActivity (id) {
  var input = document.getElementById('input' + id)
  var name = input.value
  if (name !== '') {
    input.style.backgroundColor = '#fff'
    var activity = {name: name, completion: false, id: guid()}
    projects[findProject(id)].activities.push(activity)
    input.value = ''
    storageWrite()
    render()
  } else {
    input.style.backgroundColor = '#ffe5e5'
  }
}

function deleteActivity (projectId, activityId) {
  projects[findProject(projectId)].activities.splice(findActivity(projectId, activityId), 1)
  editToggle()
  storageWrite()
  render()
}

function activityCompletion (id, index) {
  var lastIndex = projects[findProject(id)].activityIndex
  var delayTime = 0

  if (index === lastIndex) {
    index = index - 1
  }

  projects[findProject(id)].activityIndex = index

  for (var i = 0; i < projects[findProject(id)].activities.length; i++) {
    var clearElement = document.getElementById(projects[findProject(id)].activities[i].id)
    if (index < lastIndex) {
      if (i + 1 >= index) {
        delayTime = 0.15 * (lastIndex - i - 1)
      }
      clearElement.style.transitionDelay = delayTime + 's'
      clearElement.parentNode.style.transitionDelay = delayTime + 's'
    }
    clearElement.style.height = 0
    clearElement.parentNode.style.backgroundColor = 'rgba(0,0,0,0)'
  }

  delayTime = 0

  for (i = 0; i < index - 1; i++) {
    var element = document.getElementById(projects[findProject(id)].activities[i].id)
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

  var lastDot = document.getElementById(projects[findProject(id)].activities[i].id)
  if (index === 0) {
    lastDot.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 0)'
  } else {
    lastDot.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 1)'
  }

  lastDot.parentNode.style.transitionDelay = 0 + 's'
  storageWrite()
}

function moreToggle (id) {
  moreOpen = id
  storageWrite()
  var name = projects[findProject(id)].name
  document.getElementsByTagName('body')[0].className = 'moremode'

  target = document.getElementById('more')
  target.innerHTML = ''

  var header = document.createElement('header')
  var title = document.createElement('h1')
  var notes = document.createElement('textarea')
  var button = document.createElement('button')

  header.textContent = 'Back'
  header.addEventListener ('click', function () {
    back()
  })

  title.textContent = name

  notes.setAttribute('id', 'notes' + id)
  notes.placeholder = 'Notes'
  notes.value = projects[findProject(id)].notes
  notes.addEventListener('input', function (e) {
    updateNotes(id)
  })

  button.textContent = 'Add agreement'
  button.addEventListener('click', function () {
    selectAgreement(id)
  })

  target.appendChild(header)
  target.appendChild(title)
  target.appendChild(notes)
  // target.appendChild(button)
}

function updateNotes (id) {
  var element = document.getElementById('notes' + id)
  projects[findProject(id)].notes = element.value
  storageWrite()
}

function back () {
  var moreDiv = document.getElementById('more')
  var projectDiv = document.getElementById('startpage')
  projectDiv.className = 'page'
  moreDiv.className = 'page more'
  moreOpen = 'none'
  storageWrite()
  document.getElementsByTagName('body')[0].className = 'standard'
  edit = false
}

function selectAgreement (id) {
  document.getElementsByTagName('body')[0].className = 'moremode agreement'
}

function render () {
  var target = document.getElementById('projects')
  target.innerHTML = ''
  if (projects.lenght !== 0) {
    projects.forEach(function (project) {
      var div = document.createElement('div')
      var row = document.createElement('div')
      var h2 = document.createElement('h2')
      var more = document.createElement('button')
      var remove = document.createElement('button')
      var content = document.createElement('div')
      var input = document.createElement('input')
      var button = document.createElement('button')

      div.style.backgroundColor = project.color
      div.classList = 'project'
      if (projects[findProject(project.id)].expanded) {
        div.style.height = 'auto'
      }

      div.setAttribute('id', project.id)

      h2.textContent = project.name + ' ▿'
      h2.addEventListener('click', function () {
        expand(project.id)
      })

      row.classList = 'row'

      more.classList = 'more'
      more.textContent = '📕'
      more.addEventListener('click', function () {
        moreToggle(project.id)
      })

      remove.textContent = 'Delete'
      remove.addEventListener('click', function () {
        deleteProject(project.id)
      })

      for (let i = 0; i < projects[findProject(project.id)].activities.length; i++) {
        var activity = document.createElement('div')
        var dot = document.createElement('div')
        var line = document.createElement('div')
        var activitytext = document.createElement('h3')
        var removeActivity = document.createElement('button')

        activity.classList = 'activity'
        activity.addEventListener('click', function () {
          activityCompletion(project.id, i + 1)
        })
        activitytext.textContent = projects[findProject(project.id)].activities[i].name
        line.setAttribute('id', projects[findProject(project.id)].activities[i].id)
        line.classList = 'line'
        if (projects[findProject(project.id)].activityIndex - 1 > i) {
          line.style.height = '100%'
          dot.style.backgroundColor = 'rgba(255, 255, 255, 1)'
        } else if (projects[findProject(project.id)].activityIndex - 1 === i) {
          dot.style.backgroundColor = 'rgba(255, 255, 255, 1)'
        }

        if (projects[findProject(project.id)].activityIndex === 0) {
          dot.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        }

        let activityId = projects[findProject(project.id)].activities[i].id
        removeActivity.textContent = 'Delete'
        removeActivity.addEventListener('click', function () {
          deleteActivity(project.id, activityId)
        })

        dot.appendChild(line)
        activity.appendChild(dot)
        activity.appendChild(activitytext)
        activity.appendChild(removeActivity)
        content.appendChild(activity)
      }

      input.setAttribute('id', 'input' + project.id)

      button.textContent = 'New activity'
      button.addEventListener('click', function () {
        addActivity(project.id)
      })

      content.setAttribute('id', 'content' + project.id)

      row.appendChild(h2)
      row.appendChild(more)
      row.appendChild(remove)
      div.appendChild(row)
      content.appendChild(input)
      content.appendChild(button)
      div.appendChild(content)
      target.appendChild(div)

      if (moreOpen !== 'none') {
        var moreDiv = document.getElementById('more')
        var projectDiv = document.getElementById('startpage')
        projectDiv.className = 'page notransition'
        moreDiv.className = 'page more notransition'
        projectDiv.style.width.value
        moreToggle(moreOpen)
      }
    })
  } else {
    target.appendChild('')
  }
}
