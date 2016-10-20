import { el, App } from './alm/alm';

const app = new App<number>({
    state: 0,
    update: (action, n) => n + (action ? 1 : -1),
    main: scope => {
        scope.events.click
            .filter(evt => evt.getId() === 'incr-btn')
            .recv(evt => scope.actions.send(true));

        scope.events.click
            .filter(evt => evt.getId() === 'decr-btn')
            .recv(evt => scope.actions.send(false));
    },
    render: (n: number) =>
        el('div', { 'id': 'main' }, [
            el('h1', { 'key': 'hello' }, ['Hello, World!']),
            el('span', { 'id': 'buttons' }, [
                el('button', { 'id': 'incr-btn' }, ['+']),
                el('button', { 'id': 'decr-btn' }, ['-'])
            ]),
            el('p', { 'key': 'the-number' }, [n.toString()])
        ]),
    eventRoot: 'app',
    domRoot: 'app'
}).start();
