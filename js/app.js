var projects = []
var edit = false
var editWidgets = false
var moreOpen = 'none'
var popup = 'closed'

function storageWrite () {
  var projectsStorage = JSON.stringify(projects)
  localStorage.setItem('projects', projectsStorage)
  localStorage.setItem('moreOpen', moreOpen)
  localStorage.setItem('popup', popup)
}

function storageRead () {
  projects = JSON.parse(localStorage.getItem('projects'))
  if (projects === null) {
    projects = []
  }

  moreOpen = localStorage.getItem('moreOpen')
  if (moreOpen === null) {
    moreOpen = 'none'
  }

  popup = localStorage.getItem('popup')
  if (popup === null) {
    popup = 'closed'
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

function findWidget (widgetId) {
  for (var i = 0; i < projects[findProject(moreOpen)].widgets.length; i++) {
    if (projects[findProject(moreOpen)].widgets[i].id === widgetId) {
      return i
    }
  }
  return false
}

function enableTransitions () {
  document.getElementById('transitionDiv').className = ''
}

function newProject () {
  enableTransitions()
  var projectName = prompt('Project name', '')
  var color = 'rgb(' + (76 + Math.round(Math.random() * 50 - 25)) + ', ' + (189 + Math.round(Math.random() * 50 - 25)) + ', ' + (255 - Math.round(Math.random() * 25)) + ')'
  if (projectName !== '' && projectName !== null) {
    var project = {id: guid(), name: projectName, color: color, expanded: false, activities: [], activityIndex: 0, notes: '', widgets: []}
    projects.push(project)
    storageWrite()
    render()
  }
}

function editToggle () {
  enableTransitions()
  edit = !edit
  if (edit === true) {
    document.getElementsByTagName('body')[0].className = 'editmode'
  } else {
    document.getElementsByTagName('body')[0].className = 'standard'
  }
}

function widgetsEdit () {
  enableTransitions()
  editWidgets = !editWidgets
  if (editWidgets === true) {
    document.getElementsByTagName('body')[0].className = 'moremode editmode'
  } else {
    document.getElementsByTagName('body')[0].className = 'moremode'
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
  enableTransitions()
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

function moreClick (id) {
  enableTransitions()
  moreToggle(id)
}

function moreToggle (id) {
  moreOpen = id
  storageWrite()
  var name = projects[findProject(id)].name
  document.getElementsByTagName('body')[0].className = 'moremode'

  var target = document.getElementById('more')
  target.innerHTML = ''

  var backHeader = document.createElement('header')
  var edit = document.createElement('header')
  var title = document.createElement('h1')
  var widgets = document.createElement('div')
  var contactWidgets = document.createElement('div')
  var agreementWidgets = document.createElement('div')
  var notes = document.createElement('textarea')
  var button = document.createElement('button')

  backHeader.textContent = 'Back'
  backHeader.addEventListener('click', function () {
    back()
  })
  edit.textContent = 'Edit'
  edit.addEventListener('click', function () {
    widgetsEdit()
  })
  edit.className = 'right'

  title.textContent = name

  widgets.setAttribute('id', 'widgets')
  contactWidgets.setAttribute('id', 'contactWidgets')
  agreementWidgets.setAttribute('id', 'agreementWidgets')

  notes.setAttribute('id', 'notes' + id)
  notes.placeholder = 'Notes'
  notes.value = projects[findProject(id)].notes
  notes.addEventListener('input', function (e) {
    updateNotes(id)
  })

  button.textContent = 'Add widget'
  button.addEventListener('click', function () {
    selectWidget(id)
  })

  target.appendChild(backHeader)
  target.appendChild(edit)
  target.appendChild(title)
  widgets.appendChild(contactWidgets)
  widgets.appendChild(agreementWidgets)
  widgets.appendChild(notes)
  widgets.appendChild(button)
  target.appendChild(widgets)

  renderWidgets()
}

function updateNotes (id) {
  var element = document.getElementById('notes' + id)
  projects[findProject(id)].notes = element.value
  storageWrite()
}

function back () {
  enableTransitions()
  var moreDiv = document.getElementById('more')
  var projectDiv = document.getElementById('startpage')
  moreOpen = 'none'
  storageWrite()
  document.getElementsByTagName('body')[0].className = 'standard'
  edit = false
}

function selectWidget () {
  enableTransitions()
  if (popup === 'closed') {
    popup = 'selecting'
  } else {
    popup = 'closed'
  }

  storageWrite()
  if (popup !== 'closed') {
    document.getElementsByTagName('body')[0].className = 'moremode agreement'
  } else {
    document.getElementsByTagName('body')[0].className = 'moremode'
  }
}

function cancelClick () {
  if (!e) var e = window.event
  e.cancelBubble = true
  if (e.stopPropagation) e.stopPropagation()
}

function renderWidgets () {
  renderContacts()
  renderAgreements()
}

function deleteWidget (id) {
  projects[findProject(moreOpen)].widgets.splice(findWidget(id), 1)
  storageWrite()
  widgetsEdit()
  renderWidgets()
}

function widgetContactClick () {
  enableTransitions()
  widgetContactNav()
}

function widgetContactNav () {
  popup = 'contact'
  storageWrite()
  var body = document.getElementsByTagName('body')[0]
  body.className = 'moremode settings'

  var settingsBox = document.getElementsByClassName('popupSetting')[0]
  settingsBox.innerHTML = ''

  var h2 = document.createElement('h2')
  var settingsPopup = document.createElement('div')
  var name = document.createElement('h3')
  var nameInput = document.createElement('input')
  var title = document.createElement('h3')
  var titleInput = document.createElement('input')
  var job = document.createElement('h3')
  var jobInput = document.createElement('input')
  var done = document.createElement('button')

  h2.textContent = 'Create contact'
  settingsPopup.className = 'agreementPopup'
  settingsPopup.addEventListener('click', function () {
    cancelClick()
  })
  name.textContent = 'Name:'
  nameInput.setAttribute('id', 'contactName')
  title.textContent = 'Title:'
  titleInput.setAttribute('id', 'contactTitle')
  job.textContent = 'Workplace:'
  jobInput.setAttribute('id', 'contactJob')
  done.textContent = 'Done'
  done.addEventListener('click', function () {
    widgetContactSheet()
  })

  settingsBox.appendChild(h2)
  settingsPopup.appendChild(name)
  settingsPopup.appendChild(nameInput)
  settingsPopup.appendChild(title)
  settingsPopup.appendChild(titleInput)
  settingsPopup.appendChild(job)
  settingsPopup.appendChild(jobInput)
  settingsPopup.appendChild(done)
  settingsBox.appendChild(settingsPopup)
}

function widgetContactSheet () {
  var nameText = document.getElementById('contactName').value
  var titleText = document.getElementById('contactTitle').value
  var jobText = document.getElementById('contactJob').value

  if (validateString(nameText) || validateString(titleText) || validateString(jobText)) {
    var contact = {type: 'contact', name: nameText, title: titleText, job: jobText, id: guid()}
    projects[findProject(moreOpen)].widgets.push(contact)
    storageWrite()
    renderWidgets()
    if (popup !== 'closed') {
      selectWidget()
    }
  }
}

function renderContacts () {
  var target = document.getElementById('contactWidgets')
  target.innerHTML = ''
  for (let i = 0; i < projects[findProject(moreOpen)].widgets.length; i++) {
    if (projects[findProject(moreOpen)].widgets[i].type === 'contact') {
      var contactSheet = document.createElement('div')
      var remove = document.createElement('button')
      var contactIcon = document.createElement('i')
      var name = document.createElement('h3')
      var title = document.createElement('h3')
      var job = document.createElement('h3')

      contactSheet.className = 'contactSheet'
      contactIcon.className = 'fa fa-user fa-3x contactIcon'

      remove.textContent = 'Delete'
      remove.className = 'deleteButton'
      remove.addEventListener('click', function () {
        deleteWidget(projects[findProject(moreOpen)].widgets[i].id)
      })
      contactSheet.appendChild(remove)

      var nameText = projects[findProject(moreOpen)].widgets[i].name
      var titleText = projects[findProject(moreOpen)].widgets[i].title
      var jobText = projects[findProject(moreOpen)].widgets[i].job

      contactSheet.appendChild(contactIcon)
      if (validateString(nameText)) {
        name.textContent = 'Name: ' + nameText
        contactSheet.appendChild(name)
      }
      if (validateString(titleText)) {
        title.textContent = 'Title: ' + titleText
        contactSheet.appendChild(title)
      }
      if (validateString(jobText)) {
        job.textContent = 'Workplace: ' + jobText
        contactSheet.appendChild(job)
      }
      target.appendChild(contactSheet)

    }
  }
}

function widgetAgreementClick () {
  enableTransitions()
  widgetAgreementNav()
}

function widgetAgreementNav () {
  popup = 'agreement'
  storageWrite()
  var body = document.getElementsByTagName('body')[0]
  body.className = 'moremode settings'

  var settingsBox = document.getElementsByClassName('popupSetting')[0]
  settingsBox.innerHTML = ''

  var h2 = document.createElement('h2')
  var settingsPopup = document.createElement('div')
  var agreement = document.createElement('h3')
  var agreementInput = document.createElement('input')
  var done = document.createElement('button')

  h2.textContent = 'Create agreement'
  settingsPopup.className = 'agreementPopup'
  settingsPopup.addEventListener('click', function () {
    cancelClick()
  })
  agreement.textContent = 'Agreement:'
  agreementInput.setAttribute('id', 'agreementText')
  done.textContent = 'Done'
  done.addEventListener('click', function () {
    widgetAgreementSheet()
  })

  settingsBox.appendChild(h2)
  settingsPopup.appendChild(agreement)
  settingsPopup.appendChild(agreementInput)
  settingsPopup.appendChild(done)
  settingsBox.appendChild(settingsPopup)
}

function widgetAgreementSheet () {
  var agreementText = document.getElementById('agreementText').value

  if (validateString(agreementText)) {
    var agreement = {type: 'agreement', agreement: agreementText, id: guid()}
    projects[findProject(moreOpen)].widgets.push(agreement)
    storageWrite()
    renderWidgets()
    if (popup !== 'closed') {
      selectWidget()
    }
  }
}

function renderAgreements () {
  var target = document.getElementById('agreementWidgets')
  target.innerHTML = ''

  for (let i = 0; i < projects[findProject(moreOpen)].widgets.length; i++) {
    if (projects[findProject(moreOpen)].widgets[i].type === 'agreement') {
      var agreementSheet = document.createElement('div')
      var agreementIcon = document.createElement('i')
      var agreement = document.createElement('h3')
      var remove = document.createElement('button')

      agreementSheet.className = 'agreementSheet'
      agreementIcon.className = 'fa fa-handshake-o fa-2x'

      remove.textContent = 'Delete'
      remove.className = 'deleteButton'
      remove.addEventListener('click', function () {
        deleteWidget(projects[findProject(moreOpen)].widgets[i].id)
      })
      agreementSheet.appendChild(remove)

      var agreementText = projects[findProject(moreOpen)].widgets[i].agreement

      agreementSheet.appendChild(agreementIcon)
      if (validateString(agreementText)) {
        agreement.textContent = agreementText
        agreementSheet.appendChild(agreement)
      }
      target.appendChild(agreementSheet)
    }
  }
}

function validateString (string) {
  if (string !== '' && string !== null) {
    return true
  } else {
    return false
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
      var more = document.createElement('button')
      var menu = document.createElement('i')
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
      more.addEventListener('click', function () {
        moreClick(project.id)
      })

      menu.classList = 'fa fa-bars'

      remove.textContent = 'Delete'
      remove.className = 'deleteButton'
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
      more.appendChild(menu)
      row.appendChild(more)
      row.appendChild(remove)
      div.appendChild(row)
      content.appendChild(input)
      content.appendChild(button)
      div.appendChild(content)
      target.appendChild(div)
    })
    if (moreOpen !== 'none') {
      var moreDiv = document.getElementById('more')
      var projectDiv = document.getElementById('startpage')
      moreToggle(moreOpen)
    }

    if (popup !== 'closed') {
      document.getElementsByTagName('body')[0].className = 'moremode agreement'

      if (popup === 'contact') {
        widgetContactNav()
      }
      if (popup === 'agreement') {
        widgetAgreementNav()
      }
    }
  } else {
    target.appendChild('')
  }
}
