define([
    "Underscore",
    "yapp/yapp",
    "models/repo",
    "utils/github"
], function(_, yapp, Repo, github) {
    var logging = yapp.Logger.addNamespace("repos");

    // List Item View
    var RepoItem = yapp.List.Item.extend({
        className: "repo-item",
        template: "lists/repo.html",
        events: {
            "click": "open"
        },
        templateContext: function() {
            return {
                object: this.model,
            }
        },
        finish: function() {
            this.$el.attr("data-gitrap", this.model.get("owner.login")+"/"+this.model.get("name"));
            return RepoItem.__super__.finish.apply(this, arguments);
        },
        open: function() {
            yapp.History.navigate(":username/:repo", {
                username: this.model.get("owner.login"),
                repo: this.model.get("name")
            });
        }
    });

    // List View
    var ReposList = yapp.List.extend({
        className: "list-repos",
        Item: RepoItem,
        defaults: _.defaults({
            collection: github.repos
        }, yapp.List.prototype.defaults),

        /* Constructor */
        initialize: function() {
            ReposList.__super__.initialize.apply(this, arguments);
            github.getUserRepos();
            return this;
        },
    }, {
        Item: RepoItem
    });

    yapp.View.Template.registerComponent("list.repos", ReposList);

    return ReposList;
});