const observableModule = require("data/observable");

function SessionDetailViewModel(sessionModel) {
    const viewModel = observableModule.fromObject({
        session: sessionModel
    });

    return viewModel;
}

module.exports = SessionDetailViewModel;
