import { el, App } from './alm/alm';

const app = new App({
    state: 0,
    update: (action, state) => action ? state + 1 : state - 1,
    main: scope => {
        scope.events.click
            .filter(evt => evt.getId() === 'incr-btn')
            .recv(evt => scope.actions.send(true));

        scope.events.click
            .filter(evt => evt.getId() === 'decr-btn')
            .recv(evt => scope.actions.send(false));

    },
    render: state =>
        el('div', { id: 'main' }, [
            el('h1', { key: 'header' }, ['Alm Template App']),
            el('p', { key: 'the_text' }, ['Current value: ' + state]),
            el('span', { key: 'btns' }, [
                el('button', { id: 'incr-btn' }, ['+1']),
                el('button', { id: 'decr-btn' }, ['-1'])
            ])
        ])
});

app.start();
