import { searchContextDescription } from 'discourse/lib/search';
import { h } from 'virtual-dom';
import { createWidget } from 'discourse/widgets/widget';

createWidget('search-term-tm', {
  tagName: 'input.search-input-tm',
  buildId: () => 'search-term-tm',
  buildKey: () => `search-term-tm`,

  defaultState() {
    return { afterAutocomplete: false };
  },

  searchAutocompleteAfterComplete() {
    this.state.afterAutocomplete = true;
  },

  buildAttributes(attrs) {
    return { type: 'text',
             value: attrs.value || '',
             placeholder: attrs.contextEnabled ? "" : I18n.t('search.title') };
  },

  keyUp(e) {
    if (e.which === 13) {
      if (this.state.afterAutocomplete) {
        this.state.afterAutocomplete = false;
      } else {
        return this.sendWidgetAction('fullSearch');
      }
    }

    const val = this.attrs.value;
    const newVal = $(`#${this.buildId()}`).val();

    if (newVal !== val) {
      this.sendWidgetAction('searchTermChanged', newVal);
    }
  }
});

createWidget('search-context-tm', {
  tagName: 'div.search-context-tm',

  html(attrs) {
    const service = this.register.lookup('search-service:main');
    const ctx = service.get('searchContext');

    const result = [];
    if (ctx) {
      const description = searchContextDescription(Ember.get(ctx, 'type'),
                                                   Ember.get(ctx, 'user.username') || Ember.get(ctx, 'category.name'));
      result.push(h('label', [
                    h('input', { type: 'checkbox', checked: attrs.contextEnabled }),
                    ' ',
                    description
                  ]));
    }

    // if (!attrs.contextEnabled) {
    //   result.push(this.attach('link', { href: attrs.url,
    //                                     label: 'show_help',
    //                                     className: 'show-help' }));
    // }

    result.push(h('div.clearfix'));
    return result;
  },

  click() {
    const val = $('.search-context-tm input').is(':checked');
    if (val !== this.attrs.contextEnabled) {
      this.sendWidgetAction('searchContextChanged', val);
    }
  }
});
