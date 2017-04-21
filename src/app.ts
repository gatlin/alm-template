import { el, App } from './alm/alm';

type Task = {
    description: string;
    completed: boolean;
    editing: boolean;
    uid: number;
};

type TodoState = {
    tasks: Array<Task>;
    field: string;
    uid: number;
};

enum Actions {
    NoOp,
    Add,
    UpdateField,
    Delete,
    Complete,
    Editing,
    UpdateTask
};

type Action = {
    'type': Actions;
    data: any;
};

function empty_model(): TodoState {
    return {
        tasks: [new_task('Example 1', 0),
        new_task('Example 2', 1)],
        field: '',
        uid: 2
    };
}

function new_task(description, id): Task {
    return {
        description: description,
        completed: false,
        editing: false,
        uid: id
    };
}

function update_model(action: Action, model: TodoState): TodoState {
    const dispatch = {};

    dispatch[Actions.NoOp] = () => {
        return model;
    };

    dispatch[Actions.Add] = () => {
        if (model.field) {
            model.tasks.push(new_task(
                model.field, model.uid
            ));
            model.uid = model.uid + 1;
            model.field = '';
        }
        return model;
    };

    dispatch[Actions.UpdateField] = () => {
        model.field = action.data;
        return model;
    };

    dispatch[Actions.Delete] = () => {
        const uid = action.data;
        let idx = -1;
        for (let i = 0; i < model.tasks.length; i++) {
            if (model.tasks[i].uid === uid) {
                idx = i;
                break;
            }
        }
        if (idx > -1) {
            model.tasks.splice(idx, 1);
        }
        return model;
    };

    dispatch[Actions.Complete] = () => {
        const uid = action.data;
        for (let i = model.tasks.length; i--;) {
            if (model.tasks[i].uid === uid) {
                model.tasks[i].completed =
                    !model.tasks[i].completed;
                break;
            }
        }
        return model;
    };

    dispatch[Actions.Editing] = () => {
        const uid = action.data;
        for (let i = model.tasks.length; i--;) {
            if (model.tasks[i].uid === uid) {
                model.tasks[i].editing = true;
                break;
            }
        }
        return model;
    };

    dispatch[Actions.UpdateTask] = () => {
        const uid = action.data.uid;
        for (let i = model.tasks.length; i--;) {
            if (model.tasks[i].uid === uid) {
                model.tasks[i].editing = false;
                model.tasks[i].description =
                    action.data.text;
                break;
            }
        }
        return model;
    };

    return dispatch[action.type]();
}

function render_model(model) {
    let task_items = model.tasks.map(task => {
        let content = (task.editing)
            ? el('input', {
                'type': 'text',
                'class': 'editing',
                'id': 'edit-task-' + task.uid,
                'value': task.description
            }, [])
            : el('label', {
                'class': (task.completed) ? 'completed' : 'task_text',
                'id': 'text-task-' + task.uid
            }, [task.description]);

        let checkboxAttrs: any = {
            'type': 'checkbox',
            'class': 'toggle',
            'id': 'check-task-' + task.uid
        };

        if (task.completed) {
            checkboxAttrs.checked = 'checked';
        }

        return el('li', {
            'id': 'task-' + task.uid,
            'class': 'task'
        }, [
                el('input', checkboxAttrs, []),
                content,
                el('button', {
                    'class': 'delete_button',
                    'id': 'del-task-' + task.uid
                }, [])
            ]);
    });

    return el('section', { 'id': 'the_app', 'class': 'app' }, [
        el('header', { 'id': 'header', 'class': 'header' }, [
            el('h1', { key: 'title' }, ['Obligatory Todo App']),
            el('p', { key: 'wut' }, ['Double-click tasks to edit them'])
        ]),
        el('input', {
            'type': 'text',
            'id': 'field',
            'placeholder': 'What needs to be done?',
            'value': model.field
        }, []),
        el('ul', { 'class': 'todo_list', 'id': 'todo_list' }, task_items)
    ]);
}

function main(scope) {
    scope.events.change
        .filter(evt => evt.hasClass('toggle'))
        .recv(evt => scope.actions.send({
            type: Actions.Complete,
            data: parseInt(evt.getId().split('-')[2])
        }));

    scope.events.click
        .filter(evt => evt.hasClass('delete_button'))
        .recv(evt => scope.actions.send({
            type: Actions.Delete,
            data: parseInt(evt.getId().split('-')[2])
        }));

    scope.events.input
        .filter(evt => evt.getId() === 'field')
        .recv(evt => scope.actions.send({
            type: Actions.UpdateField,
            data: evt.getValue()
        }));

    scope.events.dblclick
        .filter(evt => evt.hasClass('task_text'))
        .recv(evt => scope.actions.send({
            type: Actions.Editing,
            data: parseInt(evt.getId().split('-')[2])
        }));

    scope.events.blur
        .filter(evt => evt.hasClass('editing'))
        .recv(evt => scope.actions.send({
            type: Actions.UpdateTask,
            data: {
                uid: parseInt(evt.getId().split('-')[2]),
                text: evt.getValue()
            }
        }));

    const onEnter = scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 13);

    onEnter
        .filter(evt => evt.getId() === 'field')
        .recv(evt => scope.actions.send({
            type: Actions.Add,
            data: null
        }));

    onEnter
        .filter(evt => evt.hasClass('editing'))
        .recv(evt => scope.actions.send({
            type: Actions.UpdateTask,
            data: {
                uid: parseInt(evt.getId().split('-')[2]),
                text: evt.getValue()
            }
        }));

    scope.state
        .map(st => st.tasks
            .reduce((total, task) => total + (task.completed ? 0 : 1), 0))
        .connect(scope.ports.outbound.todo_count);
}

const app = new App({
    domRoot: 'main',
    eventRoot: 'main',
    state: empty_model(),
    update: update_model,
    render: render_model,
    ports: {
        outbound: ['todo_count']
    },
    main: main
}).start();

app.ports.outbound.todo_count.recv(count => {
    document.title = (count ? '(' + count.toString() + ')' : '') + ' Todo';
});
