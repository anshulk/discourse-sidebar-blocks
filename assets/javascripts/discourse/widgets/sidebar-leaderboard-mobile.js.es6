import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLeaderboardList } from 'discourse/plugins/discourse-sidebar-blocks/discourse/helpers/leaderboard-list';

createWidget('sidebar-leaderboard-mobile', {
  tagName: 'div.sidebar-leaderboard',
	buildKey: attrs => 'sidebar-leaderboard',
	defaultState() {
		return { loading: false };
	},
	refreshUsers() {
		if (this.state.loading) { return; }
		this.state.loading = true
		this.state.users = 'empty'
		getLeaderboardList(this).then((result) => {
			// console.log("refreshUsers List : ", result);
			if (result.length) {
				this.state.users = result.splice(0,Discourse.SiteSettings.sidebar_leaderboard_mobile_count);
			} else {
				this.state.users = 'empty'
			}
			this.state.loading = false
			this.scheduleRerender()
		})
	},

	leaderboardRow(user){
		// console.log("user : ", user);
		return h("tr",
			{
				"attributes": {
					"data-user-card": user.user.username
				}
			},
			[
				h('td', [
					h('div.useravatar', this.attach('topic-participant', user.user)),
					h('div.username.trigger-data-card', user.user.username)
				]),
				h('td', [
					h('span.points', user.points+''), h('i.fa.fa-star.d-icon.d-icon-star')
				])
			]);
	},

	leaderboardHeader(){
		return h(
			'h3.sidebar-heading', {
				"attributes": {
					"onclick": "$('#caret-icon').toggleClass('fa-caret-up fa-caret-down'); $('#leaderboard-list').toggle();"
				}
			},
			[
				h('a', {
						'attributes':{
							'href':'/u',
							'title': Discourse.SiteSettings.sidebar_leaderboard_string
						}
					},
					Discourse.SiteSettings.sidebar_leaderboard_string
				),
				h('i#caret-icon.fa.fa-caret-down')
			]
		);
	},

	html(attrs, state) {
		if (!state.users) {
			this.refreshUsers();
		}
		const result = [];
		if (state.loading) {
			result.push(h('div.spinner-container', h('div.spinner')));
		} else if (state.users !== 'empty') {
			result.push(this.leaderboardHeader());

			const users = state.users.map( user => this.leaderboardRow(user))

			result.push(
				h("div.directory#leaderboard-list",
					h("table", [
					  h("tbody", [
					    users
					  ])
					])
				)
			);
		} else {
			result.push(h('div.no-messages', 'No users loaded.'))
		}

		return result;
	},

});
