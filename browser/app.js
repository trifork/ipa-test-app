// Our app is written in ES3 so that it works in older browsers!

function createRenderer(id) {
  const output = id ? document.getElementById(id) : document.body;
  return function(data) {
    output.innerText = data && typeof data === "object"
      ? JSON.stringify(data, null, 4)
      : String(data);
  };
}

function createAppender(id) {
  const output = id ? document.getElementById(id) : document.body;
  return function(data) {
    output.innerText = data && typeof data === "object"
      ? (output.innerText || "") + JSON.stringify(data, null, 4)
      : String(data);
  };
}

function App(client) {
  this.client = client;
}

App.prototype.fetchCurrentPatient = function() {
  var render = createRenderer("patient");
  render("Loading...");
  return this.client.patient.read()
  /*
  .then(render, render);
  */
 .then((patientData) => {
    console.log(patientData);
    render(patientData);
    this.patient = patientData;
    return patientData;
  })
  .catch((error) => {
    console.error(error);
    createAppender("error")(error);
  });
};

App.prototype.fetchCurrentEncounter = function() {
  var render = createRenderer("encounter");
  render("Loading...");
  return this.client.encounter.read().then(render, render);
};

App.prototype.fetchCurrentUser = function() {
  var render = createRenderer("user");
  render("Loading...");
  return this.client.user.read().then(render, render);
};

App.prototype.request = function(requestOptions, fhirOptions, target = "output") {
  var render = createRenderer(target);
  var showError = createAppender("error");
  render("Loading...");
  return this.client.request(requestOptions, fhirOptions)
  .then(render, showError);
};

App.prototype.renderContext = function() {
  return Promise.all([
    this.fetchCurrentPatient(),
    this.fetchCurrentUser(),
    this.fetchCurrentEncounter()
  ]);
};

App.prototype.setLabel = function(containerId, label, status = "ok") {
  document.getElementById(containerId).previousElementSibling.innerHTML = `<h4 class="${status}">label</h4>`;
};

