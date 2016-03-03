YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DashboardCtrl",
        "FlyoutCtrl",
        "InputCtrl",
        "LoginCtrl",
        "NavbarCtrl",
        "TableCtrl",
        "appFlyout",
        "appHeader",
        "appInput",
        "appTable",
        "flyoutFactory",
        "hotkeysFactory"
    ],
    "modules": [
        "app.bindHtmlCompile",
        "app.dashboard",
        "app.filters",
        "app.flyout",
        "app.hotkeys",
        "app.input",
        "app.login",
        "app.table"
    ],
    "allModules": [
        {
            "displayName": "app.bindHtmlCompile",
            "name": "app.bindHtmlCompile",
            "description": "Directive that binds html and then has angular compile it"
        },
        {
            "displayName": "app.dashboard",
            "name": "app.dashboard",
            "description": "module contains the logic for the dashboard page\n\nDependencies: app.table, app.flyout"
        },
        {
            "displayName": "app.filters",
            "name": "app.filters",
            "description": "Provides new filters usable anywhere this module is included"
        },
        {
            "displayName": "app.flyout",
            "name": "app.flyout",
            "description": "module contains the logic for modals, popups, and dropdowns. (flyouts)\n\nDependencies: templates(third party)"
        },
        {
            "displayName": "app.hotkeys",
            "name": "app.hotkeys",
            "description": "Provides a factory that handles the keybindings for our app\n\nDependencies: cfp.hotkeys(third party)"
        },
        {
            "displayName": "app.input",
            "name": "app.input",
            "description": "module contains the logic custom inputs\n\nDependencies: templates(third party)"
        },
        {
            "displayName": "app.login",
            "name": "app.login",
            "description": "module contains the logic custom inputs\n\nDependencies: app.input"
        },
        {
            "displayName": "app.table",
            "name": "app.table",
            "description": "module contains the logic for generating tables.\n\nDependencies: templates(third party), app.bindHtmlCompile, app.input, app.flyout,\napp.filters, app.hotkeys"
        }
    ],
    "elements": []
} };
});