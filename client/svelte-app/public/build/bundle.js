
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const userConnected = writable(false); // initial value

    const api = {};
    const url = 'http://localhost:8080';
    const error$1 = { error: 'Erreur lors de la requête' };     

    async function send(method, path, params) {
        const headers = { "Content-type": "application/json" };
        const body = params ? JSON.stringify(params) : undefined;

        const response = await fetch(url + path, { method, body, headers })
            .catch((e) => ({ error: 'Erreur lors de la connexion au serveur' }));

        if (response.status === 200) {
            const data = await response.json();
            return data
        } else {
            return error$1
        }
    }

    api.get = (path) => send('GET', path);
    api.post = (path, params) => send('POST', path, params);
    api.put = (path, params) => send('PUT', path, params);
    api.delete = (path, params) => send('DELETE', path, params);

    async function updateUser(user) {
        return await api.put(`/users/${user.id}`, user)
    }

    /* src/Settings.svelte generated by Svelte v3.47.0 */
    const file$a = "src/Settings.svelte";

    // (79:4) {#if successSubmit}
    function create_if_block_1$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Compte modifié avec succès";
    			attr_dev(div, "class", "alert alert-success");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$a, 79, 8, 2350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(79:4) {#if successSubmit}",
    		ctx
    	});

    	return block;
    }

    // (76:0) {#if errorSubmit}
    function create_if_block$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Erreur lors de la modification du compte";
    			attr_dev(div, "class", "alert alert-danger");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$a, 76, 4, 2218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(76:0) {#if errorSubmit}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div7;
    	let form;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let t8;
    	let div3;
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let div4;
    	let label4;
    	let t13;
    	let input4;
    	let t14;
    	let div5;
    	let label5;
    	let t16;
    	let input5;
    	let t17;
    	let div6;
    	let button;
    	let t19;
    	let if_block_anchor;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*errorSubmit*/ ctx[0]) return create_if_block$7;
    		if (/*successSubmit*/ ctx[1]) return create_if_block_1$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Nom d'utilisateur";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Adresse mail";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Prénom";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Nom";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Adresse";
    			t13 = space();
    			input4 = element("input");
    			t14 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "Mot de passe";
    			t16 = space();
    			input5 = element("input");
    			t17 = space();
    			div6 = element("div");
    			button = element("button");
    			button.textContent = "Confirmer";
    			t19 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$a, 40, 8, 939);
    			input0.readOnly = true;
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "username");
    			attr_dev(input0, "id", "username");
    			input0.value = /*user*/ ctx[2].username;
    			add_location(input0, file$a, 41, 8, 995);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$a, 39, 8, 912);
    			attr_dev(label1, "for", "mail");
    			add_location(label1, file$a, 45, 8, 1150);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "mail");
    			attr_dev(input1, "id", "mail");
    			input1.value = /*user*/ ctx[2].mail;
    			add_location(input1, file$a, 46, 8, 1197);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$a, 44, 8, 1123);
    			attr_dev(label2, "for", "firstName");
    			add_location(label2, file$a, 50, 8, 1331);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "firstName");
    			attr_dev(input2, "id", "firstName");
    			input2.value = /*user*/ ctx[2].firstName;
    			add_location(input2, file$a, 51, 8, 1377);
    			attr_dev(div2, "class", "mb-3");
    			add_location(div2, file$a, 49, 8, 1304);
    			attr_dev(label3, "for", "name");
    			add_location(label3, file$a, 55, 8, 1526);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "name");
    			attr_dev(input3, "id", "name");
    			input3.value = /*user*/ ctx[2].name;
    			add_location(input3, file$a, 56, 8, 1564);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file$a, 54, 8, 1499);
    			attr_dev(label4, "for", "address");
    			add_location(label4, file$a, 60, 8, 1698);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", "address");
    			attr_dev(input4, "id", "address");
    			input4.value = /*user*/ ctx[2].address;
    			add_location(input4, file$a, 61, 8, 1743);
    			attr_dev(div4, "class", "mb-3");
    			add_location(div4, file$a, 59, 8, 1671);
    			attr_dev(label5, "for", "password");
    			add_location(label5, file$a, 65, 8, 1886);
    			input5.readOnly = true;
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "type", "password");
    			attr_dev(input5, "name", "password");
    			attr_dev(input5, "id", "password");
    			input5.value = /*user*/ ctx[2].password;
    			add_location(input5, file$a, 66, 8, 1937);
    			attr_dev(div5, "class", "mb-3");
    			add_location(div5, file$a, 64, 8, 1859);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$a, 70, 8, 2096);
    			attr_dev(div6, "class", "mb-3");
    			add_location(div6, file$a, 69, 8, 2069);
    			attr_dev(form, "class", "card p-3 bg-light svelte-12c0zqe");
    			add_location(form, file$a, 38, 4, 835);
    			attr_dev(div7, "class", "container-fluid");
    			add_location(div7, file$a, 37, 0, 801);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			append_dev(form, t5);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			append_dev(form, t8);
    			append_dev(form, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			append_dev(form, t11);
    			append_dev(form, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t13);
    			append_dev(div4, input4);
    			append_dev(form, t14);
    			append_dev(form, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t16);
    			append_dev(div5, input5);
    			append_dev(form, t17);
    			append_dev(form, div6);
    			append_dev(div6, button);
    			insert_dev(target, t19, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t19);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $userConnected;
    	validate_store(userConnected, 'userConnected');
    	component_subscribe($$self, userConnected, $$value => $$invalidate(4, $userConnected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	let user = $userConnected;
    	let errorSubmit = false;
    	let successSubmit = false;

    	async function onSubmit({ target }) {
    		const formData = new FormData(target);
    		const form = {};
    		for (const [key, value] of formData) form[key] = value;
    		form.id = user.id;
    		form.type = user.type;
    		const res = await updateUser(form);

    		if (res.error) {
    			$$invalidate(0, errorSubmit = true);

    			setTimeout(
    				() => {
    					$$invalidate(0, errorSubmit = false);
    				},
    				4000
    			);
    		} else {
    			$$invalidate(1, successSubmit = true);

    			setTimeout(
    				() => {
    					$$invalidate(1, successSubmit = false);
    				},
    				4000
    			);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userConnected,
    		updateUser,
    		user,
    		errorSubmit,
    		successSubmit,
    		onSubmit,
    		$userConnected
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(2, user = $$props.user);
    		if ('errorSubmit' in $$props) $$invalidate(0, errorSubmit = $$props.errorSubmit);
    		if ('successSubmit' in $$props) $$invalidate(1, successSubmit = $$props.successSubmit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [errorSubmit, successSubmit, user, onSubmit];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.47.0 */

    const file$9 = "src/Footer.svelte";

    function create_fragment$c(ctx) {
    	let footer;
    	let div;
    	let a;
    	let i;
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			span = element("span");
    			span.textContent = "L3MIAA ©";
    			attr_dev(i, "class", "bi bi-github");
    			add_location(i, file$9, 2, 107, 194);
    			attr_dev(a, "href", "https://github.com/Jofresh/projet-periscolaire");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$9, 2, 8, 95);
    			add_location(span, file$9, 3, 8, 235);
    			attr_dev(div, "class", "container");
    			add_location(div, file$9, 1, 4, 63);
    			attr_dev(footer, "class", "footer");
    			set_style(footer, "background-color", "#f1f1f1");
    			add_location(footer, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, a);
    			append_dev(a, i);
    			append_dev(div, t0);
    			append_dev(div, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Home.svelte generated by Svelte v3.47.0 */

    function create_fragment$b(ctx) {
    	let switch_instance;
    	let t;
    	let footer;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[1]];
    	var switch_value = /*type*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*props*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[1])])
    			: {};

    			if (switch_value !== (switch_value = /*type*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $userConnected;
    	validate_store(userConnected, 'userConnected');
    	component_subscribe($$self, userConnected, $$value => $$invalidate(2, $userConnected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let { type } = $$props;

    	let props = {
    		settings: {
    			// export let settings
    			route: "settings",
    			label: "Paramètres",
    			component: Settings
    		},
    		logout: handleLogout, // export let logout
    		
    	};

    	function handleLogout() {
    		set_store_value(userConnected, $userConnected = null, $userConnected);
    	}

    	const writable_props = ['type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		userConnected,
    		Settings,
    		Footer,
    		props,
    		handleLogout,
    		$userConnected
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, props];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { type: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !('type' in props)) {
    			console.warn("<Home> was created without expected prop 'type'");
    		}
    	}

    	get type() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Login.svelte generated by Svelte v3.47.0 */
    const file$8 = "src/Login.svelte";

    // (34:8) {#if !!erreur}
    function create_if_block$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Nom d'utilisateur ou mot de passe invalide.";
    			attr_dev(div, "class", "alert alert-danger");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$8, 34, 8, 880);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(34:8) {#if !!erreur}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let form;
    	let h1;
    	let t1;
    	let t2;
    	let label0;
    	let t4;
    	let input0;
    	let t5;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let button;
    	let t10;
    	let p;
    	let mounted;
    	let dispose;
    	let if_block = !!/*erreur*/ ctx[2] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			h1 = element("h1");
    			h1.textContent = "Connexion";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "Username";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			button = element("button");
    			button.textContent = "Se connecter";
    			t10 = space();
    			p = element("p");
    			p.textContent = "© 2021-2022";
    			attr_dev(h1, "class", "h3 mb-3 font-weight-normal");
    			add_location(h1, file$8, 31, 8, 786);
    			attr_dev(label0, "for", "inputUsername");
    			attr_dev(label0, "class", "sr-only");
    			add_location(label0, file$8, 37, 8, 998);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "inputUsername");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", "Nom d'utilisateur");
    			input0.required = true;
    			add_location(input0, file$8, 38, 8, 1066);
    			attr_dev(label1, "for", "inputPassword");
    			attr_dev(label1, "class", "sr-only");
    			add_location(label1, file$8, 40, 8, 1199);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "inputPassword");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "placeholder", "Mot de passe");
    			input1.required = true;
    			add_location(input1, file$8, 41, 8, 1267);
    			attr_dev(button, "class", "btn btn-primary btn-lg btn-block");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$8, 43, 8, 1399);
    			attr_dev(p, "class", "mt-5 mb-3 text-muted");
    			add_location(p, file$8, 44, 8, 1492);
    			attr_dev(form, "class", "form-signin");
    			add_location(form, file$8, 30, 4, 716);
    			attr_dev(div, "id", "login");
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$8, 29, 0, 675);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, h1);
    			append_dev(form, t1);
    			if (if_block) if_block.m(form, null);
    			append_dev(form, t2);
    			append_dev(form, label0);
    			append_dev(form, t4);
    			append_dev(form, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t8);
    			append_dev(form, button);
    			append_dev(form, t10);
    			append_dev(form, p);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*connect*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!!/*erreur*/ ctx[2]) {
    				if (if_block) ; else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(form, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let username;
    	let password;
    	let erreur = false;

    	// onMount(async () => {
    	//     // DEBUG ONLY
    	//     // auto-signin if you don't want to log in everytime you debug
    	//     [username, password] = ['dupont', '123']
    	//     await connect()
    	// })
    	async function connect() {
    		let res = await api.post('/signin', { username, password });

    		if (res.error) {
    			$$invalidate(2, erreur = res.error);
    		} else {
    			$$invalidate(2, erreur = false);
    			userConnected.set(res);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		api,
    		userConnected,
    		username,
    		password,
    		erreur,
    		connect
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('erreur' in $$props) $$invalidate(2, erreur = $$props.erreur);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		password,
    		erreur,
    		connect,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules/svelte-navigator/src/Router.svelte generated by Svelte v3.47.0 */

    const file$7 = "node_modules/svelte-navigator/src/Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$7, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$7, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$9($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.47.0 */
    const file$6 = "node_modules/svelte-navigator/src/Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$4(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$6, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$6, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$8($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules/svelte-navigator/src/Link.svelte generated by Svelte v3.47.0 */
    const file$5 = "node_modules/svelte-navigator/src/Link.svelte";

    function create_fragment$7(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$5, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    async function getActivites() {
        return await api.get('/activites')
    }

    async function removeActivite(id) {
        return await api.delete(`/activites/${id}`)
    }

    async function getEnfantsActivite(id) {
        return await api.get(`/activites/${id}/enfants`)
    }

    async function inscrireEnfant(enfant, activite) {
        return await api.post(`/activites/${activite.id}/enfants/${enfant.id}`)
    }

    async function desinscrireEnfant(activite, enfant) {
        return await api.delete(`/activites/${activite.id}/enfants/${enfant.id}`)
    }

    async function ajouterActivite(activite) {
        return await api.post('/activites', activite)
    }

    async function editActivite(activite) {
        return await api.put(`/activites/${activite.id}`, activite)
    }

    /* src/Activites.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;

    const file$4 = "src/Activites.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[31] = list;
    	child_ctx[32] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i].value;
    	child_ctx[34] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	child_ctx[38] = list;
    	child_ctx[39] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i].value;
    	child_ctx[34] = list[i].label;
    	return child_ctx;
    }

    // (129:12) {#if perms.add || perms.update || perms.delete || perms.droppable || perms.register}
    function create_if_block_11(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			th.textContent = "Actions";
    			add_location(th, file$4, 129, 16, 3344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(129:12) {#if perms.add || perms.update || perms.delete || perms.droppable || perms.register}",
    		ctx
    	});

    	return block;
    }

    // (163:8) {:else}
    function create_else_block_3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*types*/ ctx[7].find(func).label + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*a*/ ctx[37].titre + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*a*/ ctx[37].description + "";
    	let t4;
    	let t5;
    	let td3;

    	let t6_value = (/*a*/ ctx[37].prix === 0
    	? 'Gratuit'
    	: /*a*/ ctx[37].prix) + "";

    	let t6;
    	let t7;
    	let td4;
    	let t8_value = new Date(/*a*/ ctx[37].dateDebut).toLocaleDateString('fr-FR') + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = new Date(/*a*/ ctx[37].dateFin).toLocaleDateString('fr-FR') + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12;
    	let t13;
    	let t14;

    	function func(...args) {
    		return /*func*/ ctx[19](/*a*/ ctx[37], ...args);
    	}

    	let if_block0 = /*perms*/ ctx[1].update && create_if_block_10(ctx);
    	let if_block1 = /*perms*/ ctx[1].delete && create_if_block_9(ctx);
    	let if_block2 = /*perms*/ ctx[1].register && create_if_block_8(ctx);
    	let if_block3 = /*perms*/ ctx[1].droppable && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			if (if_block0) if_block0.c();
    			t12 = space();
    			if (if_block1) if_block1.c();
    			t13 = space();
    			if (if_block2) if_block2.c();
    			t14 = space();
    			if (if_block3) if_block3.c();
    			add_location(td0, file$4, 164, 12, 4767);
    			add_location(td1, file$4, 165, 12, 4838);
    			add_location(td2, file$4, 166, 12, 4869);
    			add_location(td3, file$4, 167, 12, 4906);
    			add_location(td4, file$4, 168, 12, 4963);
    			add_location(td5, file$4, 169, 12, 5038);
    			add_location(td6, file$4, 170, 12, 5111);
    			add_location(tr, file$4, 163, 8, 4750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			if (if_block0) if_block0.m(td6, null);
    			append_dev(td6, t12);
    			if (if_block1) if_block1.m(td6, null);
    			append_dev(td6, t13);
    			if (if_block2) if_block2.m(td6, null);
    			append_dev(td6, t14);
    			if (if_block3) if_block3.m(td6, null);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*data*/ 1 && t0_value !== (t0_value = /*types*/ ctx[7].find(func).label + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*data*/ 1 && t2_value !== (t2_value = /*a*/ ctx[37].titre + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*data*/ 1 && t4_value !== (t4_value = /*a*/ ctx[37].description + "")) set_data_dev(t4, t4_value);

    			if (dirty[0] & /*data*/ 1 && t6_value !== (t6_value = (/*a*/ ctx[37].prix === 0
    			? 'Gratuit'
    			: /*a*/ ctx[37].prix) + "")) set_data_dev(t6, t6_value);

    			if (dirty[0] & /*data*/ 1 && t8_value !== (t8_value = new Date(/*a*/ ctx[37].dateDebut).toLocaleDateString('fr-FR') + "")) set_data_dev(t8, t8_value);
    			if (dirty[0] & /*data*/ 1 && t10_value !== (t10_value = new Date(/*a*/ ctx[37].dateFin).toLocaleDateString('fr-FR') + "")) set_data_dev(t10, t10_value);

    			if (/*perms*/ ctx[1].update) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(td6, t12);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*perms*/ ctx[1].delete) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					if_block1.m(td6, t13);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*perms*/ ctx[1].register) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_8(ctx);
    					if_block2.c();
    					if_block2.m(td6, t14);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*perms*/ ctx[1].droppable) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_6(ctx);
    					if_block3.c();
    					if_block3.m(td6, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(163:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (136:8) {#if toUpdates[a.id]}
    function create_if_block_4(ctx) {
    	let tr;
    	let td0;
    	let select;
    	let t0;
    	let td1;
    	let input0;
    	let t1;
    	let td2;
    	let input1;
    	let t2;
    	let td3;
    	let input2;
    	let t3;
    	let td4;
    	let input3;
    	let t4;
    	let td5;
    	let input4;
    	let t5;
    	let td6;
    	let button0;
    	let i0;
    	let t6;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*types*/ ctx[7];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[14].call(input0, /*a*/ ctx[37]);
    	}

    	function input1_input_handler() {
    		/*input1_input_handler*/ ctx[15].call(input1, /*a*/ ctx[37]);
    	}

    	function input2_input_handler() {
    		/*input2_input_handler*/ ctx[16].call(input2, /*a*/ ctx[37]);
    	}

    	function input3_input_handler() {
    		/*input3_input_handler*/ ctx[17].call(input3, /*a*/ ctx[37]);
    	}

    	function input4_input_handler() {
    		/*input4_input_handler*/ ctx[18].call(input4, /*a*/ ctx[37]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			td1 = element("td");
    			input0 = element("input");
    			t1 = space();
    			td2 = element("td");
    			input1 = element("input");
    			t2 = space();
    			td3 = element("td");
    			input2 = element("input");
    			t3 = space();
    			td4 = element("td");
    			input3 = element("input");
    			t4 = space();
    			td5 = element("td");
    			input4 = element("input");
    			t5 = space();
    			td6 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t6 = space();
    			button1 = element("button");
    			i1 = element("i");
    			add_location(select, file$4, 138, 16, 3516);
    			add_location(td0, file$4, 137, 12, 3495);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$4, 148, 16, 3901);
    			add_location(td1, file$4, 148, 12, 3897);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$4, 149, 16, 3978);
    			add_location(td2, file$4, 149, 12, 3974);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$4, 150, 16, 4061);
    			add_location(td3, file$4, 150, 12, 4057);
    			attr_dev(input3, "type", "datetime-local");
    			add_location(input3, file$4, 151, 16, 4139);
    			add_location(td4, file$4, 151, 12, 4135);
    			attr_dev(input4, "type", "datetime-local");
    			add_location(input4, file$4, 152, 16, 4230);
    			add_location(td5, file$4, 152, 12, 4226);
    			attr_dev(i0, "class", "fa fa-check");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$4, 155, 20, 4436);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success btn-sm");
    			add_location(button0, file$4, 154, 16, 4336);
    			attr_dev(i1, "class", "fa fa-times");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$4, 158, 20, 4621);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-dark btn-sm");
    			add_location(button1, file$4, 157, 16, 4525);
    			add_location(td6, file$4, 153, 12, 4315);
    			add_location(tr, file$4, 136, 8, 3478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input0);
    			set_input_value(input0, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].titre);
    			append_dev(tr, t1);
    			append_dev(tr, td2);
    			append_dev(td2, input1);
    			set_input_value(input1, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].description);
    			append_dev(tr, t2);
    			append_dev(tr, td3);
    			append_dev(td3, input2);
    			set_input_value(input2, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].prix);
    			append_dev(tr, t3);
    			append_dev(tr, td4);
    			append_dev(td4, input3);
    			set_input_value(input3, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].dateDebut);
    			append_dev(tr, t4);
    			append_dev(tr, td5);
    			append_dev(td5, input4);
    			set_input_value(input4, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].dateFin);
    			append_dev(tr, t5);
    			append_dev(tr, td6);
    			append_dev(td6, button0);
    			append_dev(button0, i0);
    			append_dev(td6, t6);
    			append_dev(td6, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler),
    					listen_dev(input1, "input", input1_input_handler),
    					listen_dev(input2, "input", input2_input_handler),
    					listen_dev(input3, "input", input3_input_handler),
    					listen_dev(input4, "input", input4_input_handler),
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*confirmEdit*/ ctx[12](/*a*/ ctx[37]))) /*confirmEdit*/ ctx[12](/*a*/ ctx[37]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*cancelEdit*/ ctx[13](/*a*/ ctx[37]))) /*cancelEdit*/ ctx[13](/*a*/ ctx[37]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*types, toUpdates, data*/ 145) {
    				each_value_4 = /*types*/ ctx[7];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*toUpdates, data*/ 17 && input0.value !== /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].titre) {
    				set_input_value(input0, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].titre);
    			}

    			if (dirty[0] & /*toUpdates, data*/ 17 && input1.value !== /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].description) {
    				set_input_value(input1, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].description);
    			}

    			if (dirty[0] & /*toUpdates, data*/ 17 && to_number(input2.value) !== /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].prix) {
    				set_input_value(input2, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].prix);
    			}

    			if (dirty[0] & /*toUpdates, data*/ 17) {
    				set_input_value(input3, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].dateDebut);
    			}

    			if (dirty[0] & /*toUpdates, data*/ 17) {
    				set_input_value(input4, /*toUpdates*/ ctx[4][/*a*/ ctx[37].id].dateFin);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(136:8) {#if toUpdates[a.id]}",
    		ctx
    	});

    	return block;
    }

    // (172:16) {#if perms.update}
    function create_if_block_10(ctx) {
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-pencil");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$4, 173, 20, 5272);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-secondary btn-sm");
    			add_location(button, file$4, 172, 16, 5167);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*updateActivite*/ ctx[10](/*a*/ ctx[37]))) /*updateActivite*/ ctx[10](/*a*/ ctx[37]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(172:16) {#if perms.update}",
    		ctx
    	});

    	return block;
    }

    // (177:16) {#if perms.delete}
    function create_if_block_9(ctx) {
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$4, 178, 20, 5521);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger btn-sm");
    			add_location(button, file$4, 177, 16, 5419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*deleteActivite*/ ctx[9](/*a*/ ctx[37]))) /*deleteActivite*/ ctx[9](/*a*/ ctx[37]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(177:16) {#if perms.delete}",
    		ctx
    	});

    	return block;
    }

    // (182:16) {#if perms.register}
    function create_if_block_8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Inscrire";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "modal");
    			attr_dev(button, "data-bs-target", "#myModal");
    			attr_dev(button, "class", "btn btn-primary btn-sm");
    			add_location(button, file$4, 182, 16, 5669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*registerEnfants*/ ctx[5](/*a*/ ctx[37]))) /*registerEnfants*/ ctx[5](/*a*/ ctx[37]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(182:16) {#if perms.register}",
    		ctx
    	});

    	return block;
    }

    // (187:16) {#if perms.droppable}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*a*/ ctx[37].dropped) return create_if_block_7;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if_block.c();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-info btn-sm");
    			add_location(button, file$4, 187, 16, 5933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if_block.m(button, null);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*showEnfantsActivite*/ ctx[11](/*a*/ ctx[37]))) /*showEnfantsActivite*/ ctx[11](/*a*/ ctx[37]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(187:16) {#if perms.droppable}",
    		ctx
    	});

    	return block;
    }

    // (191:20) {:else}
    function create_else_block_4(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-caret-down");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$4, 191, 20, 6172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(191:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (189:20) {#if a.dropped}
    function create_if_block_7(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-caret-up");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$4, 189, 20, 6074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(189:20) {#if a.dropped}",
    		ctx
    	});

    	return block;
    }

    // (143:20) {:else}
    function create_else_block_2(ctx) {
    	let option;
    	let t_value = /*label*/ ctx[34] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*value*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$4, 143, 20, 3752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(143:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (141:20) {#if toUpdates[a.id].type === value}
    function create_if_block_5(ctx) {
    	let option;
    	let t_value = /*label*/ ctx[34] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*value*/ ctx[33];
    			option.value = option.__value;
    			option.selected = true;
    			add_location(option, file$4, 141, 20, 3652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(141:20) {#if toUpdates[a.id].type === value}",
    		ctx
    	});

    	return block;
    }

    // (140:16) {#each types as { value, label }}
    function create_each_block_4(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*toUpdates*/ ctx[4][/*a*/ ctx[37].id].type === /*value*/ ctx[33]) return create_if_block_5;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(140:16) {#each types as { value, label }}",
    		ctx
    	});

    	return block;
    }

    // (199:8) {#if a.dropped && a.enfants.length > 0}
    function create_if_block_3(ctx) {
    	let table;
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let each_value_3 = /*a*/ ctx[37].enfants;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Prénom";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Nom";
    			t3 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$4, 201, 16, 6482);
    			add_location(th1, file$4, 202, 16, 6514);
    			add_location(thead, file$4, 200, 12, 6458);
    			add_location(tbody, file$4, 204, 12, 6560);
    			attr_dev(table, "class", "table table-bordered table-sm");
    			add_location(table, file$4, 199, 8, 6400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(table, t3);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 1) {
    				each_value_3 = /*a*/ ctx[37].enfants;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(199:8) {#if a.dropped && a.enfants.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (206:12) {#each a.enfants as e}
    function create_each_block_3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*e*/ ctx[30].firstName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*e*/ ctx[30].name + "";
    	let t2;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			add_location(td0, file$4, 207, 20, 6666);
    			add_location(td1, file$4, 208, 20, 6709);
    			attr_dev(tr, "class", "table-primary");
    			add_location(tr, file$4, 206, 16, 6619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 1 && t0_value !== (t0_value = /*e*/ ctx[30].firstName + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*data*/ 1 && t2_value !== (t2_value = /*e*/ ctx[30].name + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(206:12) {#each a.enfants as e}",
    		ctx
    	});

    	return block;
    }

    // (135:4) {#each data as a}
    function create_each_block_2(ctx) {
    	let t;
    	let if_block1_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*toUpdates*/ ctx[4][/*a*/ ctx[37].id]) return create_if_block_4;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*a*/ ctx[37].dropped && /*a*/ ctx[37].enfants.length > 0 && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			}

    			if (/*a*/ ctx[37].dropped && /*a*/ ctx[37].enfants.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(135:4) {#each data as a}",
    		ctx
    	});

    	return block;
    }

    // (217:4) {#if perms.add}
    function create_if_block_2$1(ctx) {
    	let tr;
    	let td0;
    	let select;
    	let t0;
    	let td1;
    	let input0;
    	let t1;
    	let td2;
    	let input1;
    	let t2;
    	let td3;
    	let input2;
    	let t3;
    	let td4;
    	let input3;
    	let t4;
    	let td5;
    	let input4;
    	let t5;
    	let td6;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*types*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			td1 = element("td");
    			input0 = element("input");
    			t1 = space();
    			td2 = element("td");
    			input1 = element("input");
    			t2 = space();
    			td3 = element("td");
    			input2 = element("input");
    			t3 = space();
    			td4 = element("td");
    			input3 = element("input");
    			t4 = space();
    			td5 = element("td");
    			input4 = element("input");
    			t5 = space();
    			td6 = element("td");
    			button = element("button");
    			button.textContent = "Ajouter";
    			attr_dev(select, "name", "type");
    			if (/*inputs*/ ctx[3].type === void 0) add_render_callback(() => /*select_change_handler*/ ctx[20].call(select));
    			add_location(select, file$4, 219, 16, 6903);
    			add_location(td0, file$4, 218, 12, 6882);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Titre");
    			attr_dev(input0, "name", "title");
    			add_location(input0, file$4, 225, 16, 7150);
    			add_location(td1, file$4, 225, 12, 7146);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Description");
    			attr_dev(input1, "name", "description");
    			add_location(input1, file$4, 226, 16, 7252);
    			add_location(td2, file$4, 226, 12, 7248);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "Prix");
    			attr_dev(input2, "name", "prix");
    			add_location(input2, file$4, 227, 16, 7372);
    			add_location(td3, file$4, 227, 12, 7368);
    			attr_dev(input3, "type", "datetime-local");
    			attr_dev(input3, "name", "dateDebut");
    			add_location(input3, file$4, 228, 16, 7473);
    			add_location(td4, file$4, 228, 12, 7469);
    			attr_dev(input4, "type", "datetime-local");
    			attr_dev(input4, "name", "dateFin");
    			add_location(input4, file$4, 229, 16, 7573);
    			add_location(td5, file$4, 229, 12, 7569);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$4, 230, 16, 7669);
    			add_location(td6, file$4, 230, 12, 7665);
    			add_location(tr, file$4, 217, 8, 6865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*inputs*/ ctx[3].type);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input0);
    			set_input_value(input0, /*inputs*/ ctx[3].titre);
    			append_dev(tr, t1);
    			append_dev(tr, td2);
    			append_dev(td2, input1);
    			set_input_value(input1, /*inputs*/ ctx[3].description);
    			append_dev(tr, t2);
    			append_dev(tr, td3);
    			append_dev(td3, input2);
    			set_input_value(input2, /*inputs*/ ctx[3].prix);
    			append_dev(tr, t3);
    			append_dev(tr, td4);
    			append_dev(td4, input3);
    			set_input_value(input3, /*inputs*/ ctx[3].dateDebut);
    			append_dev(tr, t4);
    			append_dev(tr, td5);
    			append_dev(td5, input4);
    			set_input_value(input4, /*inputs*/ ctx[3].dateFin);
    			append_dev(tr, t5);
    			append_dev(tr, td6);
    			append_dev(td6, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[20]),
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[21]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[22]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[23]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[24]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[25]),
    					listen_dev(button, "click", /*addActivite*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*types*/ 128) {
    				each_value_1 = /*types*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*inputs, types*/ 136) {
    				select_option(select, /*inputs*/ ctx[3].type);
    			}

    			if (dirty[0] & /*inputs, types*/ 136 && input0.value !== /*inputs*/ ctx[3].titre) {
    				set_input_value(input0, /*inputs*/ ctx[3].titre);
    			}

    			if (dirty[0] & /*inputs, types*/ 136 && input1.value !== /*inputs*/ ctx[3].description) {
    				set_input_value(input1, /*inputs*/ ctx[3].description);
    			}

    			if (dirty[0] & /*inputs, types*/ 136 && to_number(input2.value) !== /*inputs*/ ctx[3].prix) {
    				set_input_value(input2, /*inputs*/ ctx[3].prix);
    			}

    			if (dirty[0] & /*inputs, types*/ 136) {
    				set_input_value(input3, /*inputs*/ ctx[3].dateDebut);
    			}

    			if (dirty[0] & /*inputs, types*/ 136) {
    				set_input_value(input4, /*inputs*/ ctx[3].dateFin);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(217:4) {#if perms.add}",
    		ctx
    	});

    	return block;
    }

    // (221:20) {#each types as { value, label }}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*label*/ ctx[34] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*value*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$4, 221, 20, 7023);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(221:20) {#each types as { value, label }}",
    		ctx
    	});

    	return block;
    }

    // (266:12) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tous vos enfants sont déjà inscrits à cette activité.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(266:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (247:12) {#if activiteClicked}
    function create_if_block_1$2(ctx) {
    	let table;
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let each_value = /*activiteClicked*/ ctx[2].nonInscrits;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Nom";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Prénom";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Inscrire";
    			t5 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$4, 249, 20, 8244);
    			add_location(th1, file$4, 250, 20, 8277);
    			add_location(th2, file$4, 251, 20, 8313);
    			add_location(thead, file$4, 248, 16, 8216);
    			add_location(tbody, file$4, 253, 16, 8372);
    			attr_dev(table, "class", "table");
    			add_location(table, file$4, 247, 12, 8178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(thead, t3);
    			append_dev(thead, th2);
    			append_dev(table, t5);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*activiteClicked*/ 4) {
    				each_value = /*activiteClicked*/ ctx[2].nonInscrits;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(247:12) {#if activiteClicked}",
    		ctx
    	});

    	return block;
    }

    // (255:16) {#each activiteClicked.nonInscrits as e}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*e*/ ctx[30].firstName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*e*/ ctx[30].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let input;
    	let t4;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[26].call(input, /*each_value*/ ctx[31], /*e_index*/ ctx[32]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			input = element("input");
    			t4 = space();
    			add_location(td0, file$4, 256, 24, 8486);
    			add_location(td1, file$4, 257, 24, 8533);
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$4, 259, 28, 8608);
    			add_location(td2, file$4, 258, 24, 8575);
    			add_location(tr, file$4, 255, 20, 8457);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, input);
    			input.checked = /*e*/ ctx[30].checked;
    			append_dev(tr, t4);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*activiteClicked*/ 4 && t0_value !== (t0_value = /*e*/ ctx[30].firstName + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*activiteClicked*/ 4 && t2_value !== (t2_value = /*e*/ ctx[30].name + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*activiteClicked*/ 4) {
    				input.checked = /*e*/ ctx[30].checked;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(255:16) {#each activiteClicked.nonInscrits as e}",
    		ctx
    	});

    	return block;
    }

    // (275:12) {:else}
    function create_else_block$2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fermer";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			attr_dev(button, "data-bs-dismiss", "modal");
    			add_location(button, file$4, 275, 12, 9282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(275:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (272:12) {#if activiteClicked}
    function create_if_block$3(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Confirmer";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Annuler";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "data-bs-dismiss", "modal");
    			add_location(button0, file$4, 272, 12, 8985);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-bs-dismiss", "modal");
    			add_location(button1, file$4, 273, 12, 9116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*confirmInscription*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(272:12) {#if activiteClicked}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let t12;
    	let tbody;
    	let t13;
    	let t14;
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let h4;
    	let t16;
    	let div1;
    	let t17;
    	let div2;
    	let if_block0 = (/*perms*/ ctx[1].add || /*perms*/ ctx[1].update || /*perms*/ ctx[1].delete || /*perms*/ ctx[1].droppable || /*perms*/ ctx[1].register) && create_if_block_11(ctx);
    	let each_value_2 = /*data*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let if_block1 = /*perms*/ ctx[1].add && create_if_block_2$1(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (/*activiteClicked*/ ctx[2]) return create_if_block_1$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block2 = current_block_type(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*activiteClicked*/ ctx[2]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type_1 = select_block_type_4(ctx);
    	let if_block3 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Type";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Titre";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Prix";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Date début";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Date fin";
    			t11 = space();
    			if (if_block0) if_block0.c();
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			if (if_block1) if_block1.c();
    			t14 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Inscrivez vos enfants";
    			t16 = space();
    			div1 = element("div");
    			if_block2.c();
    			t17 = space();
    			div2 = element("div");
    			if_block3.c();
    			add_location(th0, file$4, 122, 12, 3069);
    			add_location(th1, file$4, 123, 12, 3095);
    			add_location(th2, file$4, 124, 12, 3122);
    			add_location(th3, file$4, 125, 12, 3155);
    			add_location(th4, file$4, 126, 12, 3181);
    			add_location(th5, file$4, 127, 12, 3213);
    			add_location(tr, file$4, 121, 8, 3052);
    			add_location(thead, file$4, 120, 4, 3036);
    			add_location(tbody, file$4, 133, 4, 3410);
    			attr_dev(table, "class", "table table-striped table-hover");
    			add_location(table, file$4, 119, 0, 2984);
    			attr_dev(h4, "class", "modal-title");
    			add_location(h4, file$4, 242, 11, 8032);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$4, 241, 8, 7994);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$4, 245, 8, 8107);
    			attr_dev(div2, "class", "modal-footer");
    			add_location(div2, file$4, 270, 8, 8912);
    			attr_dev(div3, "class", "modal-content");
    			add_location(div3, file$4, 239, 5, 7957);
    			attr_dev(div4, "class", "modal-dialog");
    			add_location(div4, file$4, 238, 2, 7925);
    			attr_dev(div5, "class", "modal hide fade in");
    			attr_dev(div5, "id", "myModal");
    			attr_dev(div5, "data-bs-keyboard", "false");
    			attr_dev(div5, "data-bs-backdrop", "static");
    			add_location(div5, file$4, 237, 0, 7826);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(tr, t11);
    			if (if_block0) if_block0.m(tr, null);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t13);
    			if (if_block1) if_block1.m(tbody, null);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h4);
    			append_dev(div3, t16);
    			append_dev(div3, div1);
    			if_block2.m(div1, null);
    			append_dev(div3, t17);
    			append_dev(div3, div2);
    			if_block3.m(div2, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*perms*/ ctx[1].add || /*perms*/ ctx[1].update || /*perms*/ ctx[1].delete || /*perms*/ ctx[1].droppable || /*perms*/ ctx[1].register) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_11(ctx);
    					if_block0.c();
    					if_block0.m(tr, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*data, cancelEdit, confirmEdit, toUpdates, types, showEnfantsActivite, perms, registerEnfants, deleteActivite, updateActivite*/ 16051) {
    				each_value_2 = /*data*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, t13);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (/*perms*/ ctx[1].add) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					if_block1.m(tbody, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_4(ctx)) && if_block3) {
    				if_block3.p(ctx, dirty);
    			} else {
    				if_block3.d(1);
    				if_block3 = current_block_type_1(ctx);

    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(div2, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div5);
    			if_block2.d();
    			if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Activites', slots, []);
    	let { data } = $$props;
    	let { perms } = $$props;
    	let activiteClicked = false;

    	async function registerEnfants(activite) {
    		if (perms.register) {
    			const enfants = perms.register;
    			const inscrits = await getEnfantsActivite(activite.id);
    			const nonInscrits = enfants.filter(({ id }) => !inscrits.some(e => e.id === id));

    			if (nonInscrits.length > 0) {
    				$$invalidate(2, activiteClicked = { activite, nonInscrits });
    			}
    		}
    	}

    	async function confirmInscription() {
    		const enfantsToInscrire = activiteClicked.nonInscrits.filter(({ checked }) => checked);
    		console.log(enfantsToInscrire);

    		if (enfantsToInscrire.length > 0) {
    			for (let e of enfantsToInscrire) {
    				await inscrireEnfant(e, activiteClicked.activite);
    			}
    		} //

    		$$invalidate(2, activiteClicked = false);
    	}

    	const types = [
    		{
    			value: "matin",
    			label: "Accueil du matin"
    		},
    		{ value: "soir", label: "Accueil du soir" }
    	];

    	let inputs = {
    		type: types[0].value,
    		titre: "",
    		description: "",
    		prix: "",
    		dateDebut: "2022-06-02T10:30",
    		dateFin: "2022-06-02T12:30",
    		status: true
    	};

    	let toUpdates = {};

    	async function addActivite() {
    		const activite = await ajouterActivite(inputs);

    		if (activite.error) ; else {
    			$$invalidate(0, data = [...data, activite]); //
    			_resetAddForm();
    		}
    	}

    	function _resetAddForm() {
    		$$invalidate(3, inputs.titre = $$invalidate(3, inputs.description = "", inputs), inputs);
    		$$invalidate(3, inputs.prix = 0, inputs);
    	}

    	async function deleteActivite(a) {
    		const res = await removeActivite(a.id);

    		if (res.error) ; else {
    			$$invalidate(0, data = data.filter(({ id }) => id !== a.id)); //
    		}
    	}

    	function updateActivite(a) {
    		$$invalidate(4, toUpdates = { ...toUpdates, [a.id]: a });
    		$$invalidate(4, toUpdates[a.id].dateDebut = toUpdates[a.id].dateDebut.substring(0, 16), toUpdates);
    		$$invalidate(4, toUpdates[a.id].dateFin = toUpdates[a.id].dateFin.substring(0, 16), toUpdates);
    	}

    	async function showEnfantsActivite(a) {
    		if (a.dropped) {
    			delete a.dropped;
    		} else {
    			a.dropped = true;
    			a.enfants = await getEnfantsActivite(a.id);
    		}

    		$$invalidate(0, data = [...data]);
    	}

    	async function confirmEdit(a) {
    		const activite = await editActivite(a);

    		if (activite.error) {
    			console.log('Erreur');
    		} else {
    			_removeFromUpdates(a);
    		}
    	}

    	function cancelEdit(a) {
    		_removeFromUpdates(a);
    	}

    	function _removeFromUpdates({ id }) {
    		const copy = { ...toUpdates };
    		delete copy[id];
    		$$invalidate(4, toUpdates = { ...copy });
    	}

    	const writable_props = ['data', 'perms'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Activites> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler(a) {
    		toUpdates[a.id].titre = this.value;
    		$$invalidate(4, toUpdates);
    	}

    	function input1_input_handler(a) {
    		toUpdates[a.id].description = this.value;
    		$$invalidate(4, toUpdates);
    	}

    	function input2_input_handler(a) {
    		toUpdates[a.id].prix = to_number(this.value);
    		$$invalidate(4, toUpdates);
    	}

    	function input3_input_handler(a) {
    		toUpdates[a.id].dateDebut = this.value;
    		$$invalidate(4, toUpdates);
    	}

    	function input4_input_handler(a) {
    		toUpdates[a.id].dateFin = this.value;
    		$$invalidate(4, toUpdates);
    	}

    	const func = (a, { value }) => a.type === value;

    	function select_change_handler() {
    		inputs.type = select_value(this);
    		$$invalidate(3, inputs);
    		$$invalidate(7, types);
    	}

    	function input0_input_handler_1() {
    		inputs.titre = this.value;
    		$$invalidate(3, inputs);
    		$$invalidate(7, types);
    	}

    	function input1_input_handler_1() {
    		inputs.description = this.value;
    		$$invalidate(3, inputs);
    		$$invalidate(7, types);
    	}

    	function input2_input_handler_1() {
    		inputs.prix = to_number(this.value);
    		$$invalidate(3, inputs);
    		$$invalidate(7, types);
    	}

    	function input3_input_handler_1() {
    		inputs.dateDebut = this.value;
    		$$invalidate(3, inputs);
    		$$invalidate(7, types);
    	}

    	function input4_input_handler_1() {
    		inputs.dateFin = this.value;
    		$$invalidate(3, inputs);
    		$$invalidate(7, types);
    	}

    	function input_change_handler(each_value, e_index) {
    		each_value[e_index].checked = this.checked;
    		$$invalidate(2, activiteClicked);
    	}

    	const click_handler = () => {
    		$$invalidate(2, activiteClicked = false);
    	};

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('perms' in $$props) $$invalidate(1, perms = $$props.perms);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		perms,
    		getEnfantsActivite,
    		ajouterActivite,
    		removeActivite,
    		editActivite,
    		inscrireEnfant,
    		activiteClicked,
    		registerEnfants,
    		confirmInscription,
    		types,
    		inputs,
    		toUpdates,
    		addActivite,
    		_resetAddForm,
    		deleteActivite,
    		updateActivite,
    		showEnfantsActivite,
    		confirmEdit,
    		cancelEdit,
    		_removeFromUpdates
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('perms' in $$props) $$invalidate(1, perms = $$props.perms);
    		if ('activiteClicked' in $$props) $$invalidate(2, activiteClicked = $$props.activiteClicked);
    		if ('inputs' in $$props) $$invalidate(3, inputs = $$props.inputs);
    		if ('toUpdates' in $$props) $$invalidate(4, toUpdates = $$props.toUpdates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		perms,
    		activiteClicked,
    		inputs,
    		toUpdates,
    		registerEnfants,
    		confirmInscription,
    		types,
    		addActivite,
    		deleteActivite,
    		updateActivite,
    		showEnfantsActivite,
    		confirmEdit,
    		cancelEdit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		func,
    		select_change_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1,
    		input_change_handler,
    		click_handler
    	];
    }

    class Activites extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { data: 0, perms: 1 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Activites",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console_1$2.warn("<Activites> was created without expected prop 'data'");
    		}

    		if (/*perms*/ ctx[1] === undefined && !('perms' in props)) {
    			console_1$2.warn("<Activites> was created without expected prop 'perms'");
    		}
    	}

    	get data() {
    		throw new Error("<Activites>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Activites>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get perms() {
    		throw new Error("<Activites>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set perms(value) {
    		throw new Error("<Activites>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Welcome.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/Welcome.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h1;
    	let t1;
    	let t2_value = /*user*/ ctx[0].firstName + "";
    	let t2;
    	let t3;
    	let t4_value = /*user*/ ctx[0].name + "";
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			t1 = text("Bonjour ");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			if (!src_url_equal(img.src, img_src_value = "kids.jpeg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "kids playing");
    			attr_dev(img, "class", "svelte-vsq7y8");
    			add_location(img, file$3, 5, 4, 66);
    			add_location(h1, file$3, 8, 8, 142);
    			attr_dev(div0, "class", "content svelte-vsq7y8");
    			add_location(div0, file$3, 7, 4, 112);
    			attr_dev(div1, "class", "welcome svelte-vsq7y8");
    			add_location(div1, file$3, 4, 0, 40);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1 && t2_value !== (t2_value = /*user*/ ctx[0].firstName + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*user*/ 1 && t4_value !== (t4_value = /*user*/ ctx[0].name + "")) set_data_dev(t4, t4_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Welcome', slots, []);
    	let { user } = $$props;
    	const writable_props = ['user'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Welcome> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	$$self.$capture_state = () => ({ user });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user];
    }

    class Welcome extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { user: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Welcome",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*user*/ ctx[0] === undefined && !('user' in props)) {
    			console.warn("<Welcome> was created without expected prop 'user'");
    		}
    	}

    	get user() {
    		throw new Error("<Welcome>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<Welcome>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Mairie.svelte generated by Svelte v3.47.0 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$2 = "src/Mairie.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i].path;
    	child_ctx[11] = list[i].text;
    	return child_ctx;
    }

    // (83:24) <Link to="/" class="nav-link">
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(83:24) <Link to=\\\"/\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (86:24) <Link to="activites" class="nav-link">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Activités");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(86:24) <Link to=\\\"activites\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (89:24) <Link to="create" class="nav-link">
    function create_default_slot_7$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Créer un compte");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(89:24) <Link to=\\\"create\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:24) <Link to={settings.route} class="nav-link">
    function create_default_slot_6$2(ctx) {
    	let t_value = /*settings*/ ctx[0].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(94:24) <Link to={settings.route} class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (97:24) <Link to="/" class="nav-link" on:click={logout}>
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Déconnexion");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(97:24) <Link to=\\\"/\\\" class=\\\"nav-link\\\" on:click={logout}>",
    		ctx
    	});

    	return block;
    }

    // (105:4) <Route path="/" primary={false}>
    function create_default_slot_4$2(ctx) {
    	let welcome;
    	let current;

    	welcome = new Welcome({
    			props: { user: /*$userConnected*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(welcome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(welcome, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const welcome_changes = {};
    			if (dirty & /*$userConnected*/ 16) welcome_changes.user = /*$userConnected*/ ctx[4];
    			welcome.$set(welcome_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(welcome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(105:4) <Route path=\\\"/\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let settings     export let logout      import { Router, Route, Link }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>     export let settings     export let logout      import { Router, Route, Link }",
    		ctx
    	});

    	return block;
    }

    // (110:36)          <Activites data={data}
    function create_then_block$1(ctx) {
    	let activites_1;
    	let current;

    	activites_1 = new Activites({
    			props: {
    				data: /*data*/ ctx[14],
    				perms: /*perms*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(activites_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activites_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activites_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activites_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activites_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(110:36)          <Activites data={data}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let settings     export let logout      import { Router, Route, Link }
    function create_pending_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(1:0) <script>     export let settings     export let logout      import { Router, Route, Link }",
    		ctx
    	});

    	return block;
    }

    // (109:4) <Route path="activites" primary={false}>
    function create_default_slot_3$2(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 14,
    		blocks: [,,,]
    	};

    	handle_promise(/*activites*/ ctx[7], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(109:4) <Route path=\\\"activites\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (120:20) {#each types as { path, text }}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*text*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*path*/ ctx[10];
    			option.value = option.__value;
    			add_location(option, file$2, 120, 20, 4029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(120:20) {#each types as { path, text }}",
    		ctx
    	});

    	return block;
    }

    // (150:12) {#if successSubmit}
    function create_if_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Compte créé avec succès";
    			attr_dev(div, "class", "alert alert-success");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$2, 150, 12, 5300);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(150:12) {#if successSubmit}",
    		ctx
    	});

    	return block;
    }

    // (147:8) {#if errorSubmit}
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Erreur lors de la création du compte";
    			attr_dev(div, "class", "alert alert-danger");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$2, 147, 8, 5152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(147:8) {#if errorSubmit}",
    		ctx
    	});

    	return block;
    }

    // (115:4) <Route path="create" primary={false}>
    function create_default_slot_2$2(ctx) {
    	let div;
    	let form;
    	let label0;
    	let t1;
    	let select;
    	let t2;
    	let label1;
    	let t4;
    	let input0;
    	let t5;
    	let label2;
    	let t7;
    	let input1;
    	let t8;
    	let label3;
    	let t10;
    	let input2;
    	let t11;
    	let label4;
    	let t13;
    	let input3;
    	let t14;
    	let label5;
    	let t16;
    	let input4;
    	let t17;
    	let label6;
    	let t19;
    	let input5;
    	let t20;
    	let button;
    	let t22;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let each_value = /*types*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*errorSubmit*/ ctx[2]) return create_if_block$2;
    		if (/*successSubmit*/ ctx[3]) return create_if_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Type d'utilisateur";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "Nom d'utilisateur";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			label2 = element("label");
    			label2.textContent = "Mot de passe";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			label3 = element("label");
    			label3.textContent = "Prénom";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			label4 = element("label");
    			label4.textContent = "Nom";
    			t13 = space();
    			input3 = element("input");
    			t14 = space();
    			label5 = element("label");
    			label5.textContent = "Mail";
    			t16 = space();
    			input4 = element("input");
    			t17 = space();
    			label6 = element("label");
    			label6.textContent = "Adresse";
    			t19 = space();
    			input5 = element("input");
    			t20 = space();
    			button = element("button");
    			button.textContent = "Créer";
    			t22 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(label0, "for", "type");
    			add_location(label0, file$2, 117, 16, 3844);
    			attr_dev(select, "class", "form-control");
    			attr_dev(select, "name", "type");
    			attr_dev(select, "id", "type");
    			add_location(select, file$2, 118, 16, 3905);
    			attr_dev(label1, "for", "username");
    			add_location(label1, file$2, 124, 16, 4141);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "name", "username");
    			add_location(input0, file$2, 125, 16, 4205);
    			attr_dev(label2, "for", "password");
    			add_location(label2, file$2, 127, 16, 4295);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "name", "password");
    			add_location(input1, file$2, 128, 16, 4354);
    			attr_dev(label3, "for", "firstName");
    			add_location(label3, file$2, 130, 16, 4448);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "firstName");
    			attr_dev(input2, "name", "firstName");
    			add_location(input2, file$2, 131, 16, 4502);
    			attr_dev(label4, "for", "name");
    			add_location(label4, file$2, 133, 16, 4594);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "name");
    			attr_dev(input3, "name", "name");
    			add_location(input3, file$2, 134, 16, 4640);
    			attr_dev(label5, "for", "mail");
    			add_location(label5, file$2, 136, 16, 4722);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "mail");
    			attr_dev(input4, "name", "mail");
    			add_location(input4, file$2, 137, 16, 4769);
    			attr_dev(label6, "for", "address");
    			add_location(label6, file$2, 139, 16, 4851);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "id", "address");
    			attr_dev(input5, "name", "address");
    			add_location(input5, file$2, 140, 16, 4904);
    			attr_dev(button, "class", "form-control btn btn-primary");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$2, 142, 16, 5008);
    			attr_dev(form, "class", "card p-3 bg-light svelte-12c0zqe");
    			add_location(form, file$2, 116, 12, 3759);
    			attr_dev(div, "class", "container-fluid");
    			add_location(div, file$2, 115, 8, 3717);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, label0);
    			append_dev(form, t1);
    			append_dev(form, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			append_dev(form, t2);
    			append_dev(form, label1);
    			append_dev(form, t4);
    			append_dev(form, input0);
    			append_dev(form, t5);
    			append_dev(form, label2);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			append_dev(form, t8);
    			append_dev(form, label3);
    			append_dev(form, t10);
    			append_dev(form, input2);
    			append_dev(form, t11);
    			append_dev(form, label4);
    			append_dev(form, t13);
    			append_dev(form, input3);
    			append_dev(form, t14);
    			append_dev(form, label5);
    			append_dev(form, t16);
    			append_dev(form, input4);
    			append_dev(form, t17);
    			append_dev(form, label6);
    			append_dev(form, t19);
    			append_dev(form, input5);
    			append_dev(form, t20);
    			append_dev(form, button);
    			insert_dev(target, t22, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[8]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*types*/ 64) {
    				each_value = /*types*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t22);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(115:4) <Route path=\\\"create\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (156:4) <Route path={settings.route} primary={false}>
    function create_default_slot_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*settings*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*settings*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(156:4) <Route path={settings.route} primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (72:0) <Router>
    function create_default_slot$2(ctx) {
    	let nav;
    	let div1;
    	let span0;
    	let t1;
    	let button;
    	let span1;
    	let t2;
    	let div0;
    	let ul0;
    	let li0;
    	let link0;
    	let t3;
    	let li1;
    	let link1;
    	let t4;
    	let li2;
    	let link2;
    	let t5;
    	let ul1;
    	let li3;
    	let link3;
    	let t6;
    	let li4;
    	let link4;
    	let t7;
    	let main;
    	let route0;
    	let t8;
    	let route1;
    	let t9;
    	let route2;
    	let t10;
    	let route3;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "activites",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "create",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: /*settings*/ ctx[0].route,
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4.$on("click", function () {
    		if (is_function(/*logout*/ ctx[1])) /*logout*/ ctx[1].apply(this, arguments);
    	});

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				primary: false,
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "activites",
    				primary: false,
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "create",
    				primary: false,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: /*settings*/ ctx[0].route,
    				primary: false,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Centre Périscolaire";
    			t1 = space();
    			button = element("button");
    			span1 = element("span");
    			t2 = space();
    			div0 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t3 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t4 = space();
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t5 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			create_component(link3.$$.fragment);
    			t6 = space();
    			li4 = element("li");
    			create_component(link4.$$.fragment);
    			t7 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t8 = space();
    			create_component(route1.$$.fragment);
    			t9 = space();
    			create_component(route2.$$.fragment);
    			t10 = space();
    			create_component(route3.$$.fragment);
    			attr_dev(span0, "class", "navbar-brand");
    			add_location(span0, file$2, 75, 12, 2013);
    			attr_dev(span1, "class", "navbar-toggler-icon");
    			add_location(span1, file$2, 77, 16, 2300);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarSupportedContent");
    			attr_dev(button, "aria-controls", "navbarSupportedContent");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file$2, 76, 12, 2079);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$2, 81, 20, 2511);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$2, 84, 20, 2645);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$2, 87, 20, 2792);
    			attr_dev(ul0, "class", "navbar-nav me-auto");
    			add_location(ul0, file$2, 80, 16, 2459);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file$2, 92, 20, 3012);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file$2, 95, 20, 3171);
    			attr_dev(ul1, "class", "navbar-nav ms-auto");
    			add_location(ul1, file$2, 91, 16, 2960);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarSupportedContent");
    			add_location(div0, file$2, 79, 12, 2376);
    			attr_dev(div1, "class", "container-fluid");
    			add_location(div1, file$2, 74, 8, 1971);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-dark bg-dark");
    			add_location(nav, file$2, 73, 4, 1905);
    			attr_dev(main, "class", "container");
    			add_location(main, file$2, 103, 4, 3382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, button);
    			append_dev(button, span1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul0, t4);
    			append_dev(ul0, li2);
    			mount_component(link2, li2, null);
    			append_dev(div0, t5);
    			append_dev(div0, ul1);
    			append_dev(ul1, li3);
    			mount_component(link3, li3, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li4);
    			mount_component(link4, li4, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t8);
    			mount_component(route1, main, null);
    			append_dev(main, t9);
    			mount_component(route2, main, null);
    			append_dev(main, t10);
    			mount_component(route3, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};
    			if (dirty & /*settings*/ 1) link3_changes.to = /*settings*/ ctx[0].route;

    			if (dirty & /*$$scope, settings*/ 32769) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope, $userConnected*/ 32784) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, errorSubmit, successSubmit*/ 32780) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};
    			if (dirty & /*settings*/ 1) route3_changes.path = /*settings*/ ctx[0].route;

    			if (dirty & /*$$scope, settings*/ 32769) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(72:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, settings, errorSubmit, successSubmit, $userConnected, logout*/ 32799) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $userConnected;
    	validate_store(userConnected, 'userConnected');
    	component_subscribe($$self, userConnected, $$value => $$invalidate(4, $userConnected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mairie', slots, []);
    	let { settings } = $$props;
    	let { logout } = $$props;
    	const perms = { droppable: true };

    	const types = [
    		//{ path: "mairie", discriminator: "1", text: "Mairie" },
    		{
    			path: "parents",
    			discriminator: "3",
    			text: "Parent"
    		},
    		{
    			path: "periscolaire",
    			discriminator: "2",
    			text: "Périscolaire"
    		}
    	];

    	let activites = fetchActivites();

    	async function fetchActivites() {
    		const res = await getActivites();
    		return res;
    	}

    	let errorSubmit = false;
    	let successSubmit = false;

    	async function onSubmit(e) {
    		const formData = new FormData(e.target);
    		const form = {};

    		for (const [key, value] of formData) {
    			form[key] = value;
    		}

    		const newUser = {
    			username: form.username,
    			password: form.password,
    			firstName: form.firstName,
    			name: form.name,
    			mail: form.mail,
    			address: form.address
    		};

    		if (Object.values(newUser).every(field => field !== "")) {
    			const res = await api.post(`/${form.type}`, newUser);
    			console.log(res);

    			if (res.error) {
    				$$invalidate(2, errorSubmit = true);

    				setTimeout(
    					() => {
    						$$invalidate(2, errorSubmit = false);
    					},
    					4000
    				);
    			} else {
    				$$invalidate(3, successSubmit = true);

    				setTimeout(
    					() => {
    						$$invalidate(3, successSubmit = false);
    					},
    					4000
    				);
    			}
    		} else {
    			console.log('Fill all the fields.');
    		}
    	}

    	const writable_props = ['settings', 'logout'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Mairie> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('logout' in $$props) $$invalidate(1, logout = $$props.logout);
    	};

    	$$self.$capture_state = () => ({
    		settings,
    		logout,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		onMount,
    		api,
    		Activites,
    		Welcome,
    		getActivites,
    		userConnected,
    		perms,
    		types,
    		activites,
    		fetchActivites,
    		errorSubmit,
    		successSubmit,
    		onSubmit,
    		$userConnected
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('logout' in $$props) $$invalidate(1, logout = $$props.logout);
    		if ('activites' in $$props) $$invalidate(7, activites = $$props.activites);
    		if ('errorSubmit' in $$props) $$invalidate(2, errorSubmit = $$props.errorSubmit);
    		if ('successSubmit' in $$props) $$invalidate(3, successSubmit = $$props.successSubmit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		logout,
    		errorSubmit,
    		successSubmit,
    		$userConnected,
    		perms,
    		types,
    		activites,
    		onSubmit
    	];
    }

    class Mairie extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { settings: 0, logout: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mairie",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1$1.warn("<Mairie> was created without expected prop 'settings'");
    		}

    		if (/*logout*/ ctx[1] === undefined && !('logout' in props)) {
    			console_1$1.warn("<Mairie> was created without expected prop 'logout'");
    		}
    	}

    	get settings() {
    		throw new Error("<Mairie>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Mairie>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logout() {
    		throw new Error("<Mairie>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logout(value) {
    		throw new Error("<Mairie>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Periscolaire.svelte generated by Svelte v3.47.0 */
    const file$1 = "src/Periscolaire.svelte";

    // (37:24) <Link to="/" class="nav-link">
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(37:24) <Link to=\\\"/\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:24) <Link to="activites" class="nav-link">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Activités");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(40:24) <Link to=\\\"activites\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:24) <Link to={settings.route} class="nav-link">
    function create_default_slot_5$1(ctx) {
    	let t_value = /*settings*/ ctx[0].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(45:24) <Link to={settings.route} class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:24) <Link to="/" class="nav-link" on:click={logout}>
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Déconnexion");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(48:24) <Link to=\\\"/\\\" class=\\\"nav-link\\\" on:click={logout}>",
    		ctx
    	});

    	return block;
    }

    // (56:8) <Route path="/" primary={false}>
    function create_default_slot_3$1(ctx) {
    	let welcome;
    	let current;

    	welcome = new Welcome({
    			props: { user: /*$userConnected*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(welcome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(welcome, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const welcome_changes = {};
    			if (dirty & /*$userConnected*/ 4) welcome_changes.user = /*$userConnected*/ ctx[2];
    			welcome.$set(welcome_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(welcome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(56:8) <Route path=\\\"/\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let settings     export let logout      import { Router, Route, Link }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     export let settings     export let logout      import { Router, Route, Link }",
    		ctx
    	});

    	return block;
    }

    // (60:40)              <Activites data={data}
    function create_then_block(ctx) {
    	let activites_1;
    	let current;

    	activites_1 = new Activites({
    			props: {
    				data: /*data*/ ctx[6],
    				perms: /*perms*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(activites_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activites_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activites_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activites_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activites_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(60:40)              <Activites data={data}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let settings     export let logout      import { Router, Route, Link }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>     export let settings     export let logout      import { Router, Route, Link }",
    		ctx
    	});

    	return block;
    }

    // (59:8) <Route path="activites" primary={false}>
    function create_default_slot_2$1(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(/*activites*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(59:8) <Route path=\\\"activites\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (64:8) <Route path={settings.route} primary={false}>
    function create_default_slot_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*settings*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*settings*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(64:8) <Route path={settings.route} primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (27:0) <Router>
    function create_default_slot$1(ctx) {
    	let nav;
    	let div1;
    	let span0;
    	let t1;
    	let button;
    	let span1;
    	let t2;
    	let div0;
    	let ul0;
    	let li0;
    	let link0;
    	let t3;
    	let li1;
    	let link1;
    	let t4;
    	let ul1;
    	let li2;
    	let link2;
    	let t5;
    	let li3;
    	let link3;
    	let t6;
    	let main;
    	let route0;
    	let t7;
    	let route1;
    	let t8;
    	let route2;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "activites",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: /*settings*/ ctx[0].route,
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3.$on("click", function () {
    		if (is_function(/*logout*/ ctx[1])) /*logout*/ ctx[1].apply(this, arguments);
    	});

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				primary: false,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "activites",
    				primary: false,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: /*settings*/ ctx[0].route,
    				primary: false,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Centre Périscolaire";
    			t1 = space();
    			button = element("button");
    			span1 = element("span");
    			t2 = space();
    			div0 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t3 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t4 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t5 = space();
    			li3 = element("li");
    			create_component(link3.$$.fragment);
    			t6 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t7 = space();
    			create_component(route1.$$.fragment);
    			t8 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(span0, "class", "navbar-brand");
    			add_location(span0, file$1, 29, 12, 695);
    			attr_dev(span1, "class", "navbar-toggler-icon");
    			add_location(span1, file$1, 31, 16, 982);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarSupportedContent");
    			attr_dev(button, "aria-controls", "navbarSupportedContent");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file$1, 30, 12, 761);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$1, 35, 20, 1193);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$1, 38, 20, 1327);
    			attr_dev(ul0, "class", "navbar-nav me-auto");
    			add_location(ul0, file$1, 34, 16, 1141);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$1, 43, 20, 1544);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file$1, 46, 20, 1703);
    			attr_dev(ul1, "class", "navbar-nav ms-auto");
    			add_location(ul1, file$1, 42, 16, 1492);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarSupportedContent");
    			add_location(div0, file$1, 33, 12, 1058);
    			attr_dev(div1, "class", "container-fluid");
    			add_location(div1, file$1, 28, 8, 653);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-dark bg-dark");
    			add_location(nav, file$1, 27, 4, 587);
    			attr_dev(main, "class", "container");
    			add_location(main, file$1, 54, 4, 1914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, button);
    			append_dev(button, span1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			mount_component(link1, li1, null);
    			append_dev(div0, t4);
    			append_dev(div0, ul1);
    			append_dev(ul1, li2);
    			mount_component(link2, li2, null);
    			append_dev(ul1, t5);
    			append_dev(ul1, li3);
    			mount_component(link3, li3, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t7);
    			mount_component(route1, main, null);
    			append_dev(main, t8);
    			mount_component(route2, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};
    			if (dirty & /*settings*/ 1) link2_changes.to = /*settings*/ ctx[0].route;

    			if (dirty & /*$$scope, settings*/ 129) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope, $userConnected*/ 132) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};
    			if (dirty & /*settings*/ 1) route2_changes.path = /*settings*/ ctx[0].route;

    			if (dirty & /*$$scope, settings*/ 129) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(27:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, settings, $userConnected, logout*/ 135) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $userConnected;
    	validate_store(userConnected, 'userConnected');
    	component_subscribe($$self, userConnected, $$value => $$invalidate(2, $userConnected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Periscolaire', slots, []);
    	let { settings } = $$props;
    	let { logout } = $$props;

    	let perms = {
    		add: true,
    		update: true,
    		delete: true,
    		droppable: true
    	};

    	let activites = fetchActivites();

    	async function fetchActivites() {
    		const res = await getActivites();
    		return res;
    	}

    	const writable_props = ['settings', 'logout'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Periscolaire> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('logout' in $$props) $$invalidate(1, logout = $$props.logout);
    	};

    	$$self.$capture_state = () => ({
    		settings,
    		logout,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		getActivites,
    		userConnected,
    		Activites,
    		Welcome,
    		perms,
    		activites,
    		fetchActivites,
    		$userConnected
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('logout' in $$props) $$invalidate(1, logout = $$props.logout);
    		if ('perms' in $$props) $$invalidate(3, perms = $$props.perms);
    		if ('activites' in $$props) $$invalidate(4, activites = $$props.activites);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, logout, $userConnected, perms, activites];
    }

    class Periscolaire extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { settings: 0, logout: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Periscolaire",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console.warn("<Periscolaire> was created without expected prop 'settings'");
    		}

    		if (/*logout*/ ctx[1] === undefined && !('logout' in props)) {
    			console.warn("<Periscolaire> was created without expected prop 'logout'");
    		}
    	}

    	get settings() {
    		throw new Error("<Periscolaire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Periscolaire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logout() {
    		throw new Error("<Periscolaire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logout(value) {
    		throw new Error("<Periscolaire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    async function removeEnfant(id) {
        return await api.delete(`/enfants/${id}`)
    }

    async function getActivitesEnfant(id) {
        return await api.get(`/enfants/${id}/activites`)
    }

    async function getEnfantsParent(id) {
        return await api.get(`/parents/${id}/enfants`)
    }

    // export async function inscrireEnfant(enfant, activite) {
    //     return await api.post('/inscription', { enfant: enfant.id, activite: activite.id })
    // }

    async function addEnfant(id, enfant) {
        return await api.post(`/parents/${id}/enfants`, enfant)
    }

    async function editEnfant(enfant) {
        return await api.put(`/enfants/${enfant.id}`, enfant)
    }

    /* src/Parent.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;

    const file = "src/Parent.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[22] = list;
    	child_ctx[23] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (115:28) <Link to="/" class="nav-link">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(115:28) <Link to=\\\"/\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:28) <Link to="activites" class="nav-link">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Activités");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(118:28) <Link to=\\\"activites\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (121:28) <Link to="enfants" class="nav-link">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Mes enfants");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(121:28) <Link to=\\\"enfants\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (126:28) <Link to={settings.route} class="nav-link">
    function create_default_slot_6(ctx) {
    	let t_value = /*settings*/ ctx[0].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*settings*/ 1 && t_value !== (t_value = /*settings*/ ctx[0].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(126:28) <Link to={settings.route} class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (129:28) <Link to="/" class="nav-link" on:click={logout}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Déconnexion");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(129:28) <Link to=\\\"/\\\" class=\\\"nav-link\\\" on:click={logout}>",
    		ctx
    	});

    	return block;
    }

    // (137:12) <Route path="/" primary={false}>
    function create_default_slot_4(ctx) {
    	let welcome;
    	let current;

    	welcome = new Welcome({
    			props: { user: /*$userConnected*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(welcome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(welcome, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const welcome_changes = {};
    			if (dirty & /*$userConnected*/ 64) welcome_changes.user = /*$userConnected*/ ctx[6];
    			welcome.$set(welcome_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(welcome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(137:12) <Route path=\\\"/\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (141:12) <Route path="activites" primary={false}>
    function create_default_slot_3(ctx) {
    	let activites_1;
    	let current;

    	activites_1 = new Activites({
    			props: {
    				data: /*activites*/ ctx[4],
    				perms: { register: /*enfants*/ ctx[2] }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(activites_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activites_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const activites_1_changes = {};
    			if (dirty & /*activites*/ 16) activites_1_changes.data = /*activites*/ ctx[4];
    			if (dirty & /*enfants*/ 4) activites_1_changes.perms = { register: /*enfants*/ ctx[2] };
    			activites_1.$set(activites_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activites_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activites_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activites_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(141:12) <Route path=\\\"activites\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (171:24) {:else}
    function create_else_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*e*/ ctx[21].firstName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*e*/ ctx[21].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = new Date(/*e*/ ctx[21].dateBirth).toLocaleDateString('fr-FR') + "";
    	let t4;
    	let t5;
    	let td3;
    	let button0;
    	let i0;
    	let t6;
    	let button1;
    	let i1;
    	let t7;
    	let button2;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*e*/ ctx[21].dropped) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t6 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t7 = space();
    			button2 = element("button");
    			if_block.c();
    			add_location(td0, file, 172, 28, 5940);
    			add_location(td1, file, 173, 28, 5991);
    			add_location(td2, file, 174, 28, 6037);
    			attr_dev(i0, "class", "fa fa-trash");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file, 177, 36, 6281);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-danger btn-sm");
    			add_location(button0, file, 176, 32, 6165);
    			attr_dev(i1, "class", "fa fa-pencil");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file, 181, 36, 6522);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary btn-sm");
    			add_location(button1, file, 180, 32, 6403);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-info btn-sm");
    			add_location(button2, file, 184, 32, 6645);
    			add_location(td3, file, 175, 28, 6128);
    			add_location(tr, file, 171, 24, 5907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, button0);
    			append_dev(button0, i0);
    			append_dev(td3, t6);
    			append_dev(td3, button1);
    			append_dev(button1, i1);
    			append_dev(td3, t7);
    			append_dev(td3, button2);
    			if_block.m(button2, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*deleteEnfant*/ ctx[8](/*e*/ ctx[21]))) /*deleteEnfant*/ ctx[8](/*e*/ ctx[21]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*updateEnfant*/ ctx[9](/*e*/ ctx[21]))) /*updateEnfant*/ ctx[9](/*e*/ ctx[21]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*showActivitesEnfant*/ ctx[12](/*e*/ ctx[21]))) /*showActivitesEnfant*/ ctx[12](/*e*/ ctx[21]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*enfants*/ 4 && t0_value !== (t0_value = /*e*/ ctx[21].firstName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*enfants*/ 4 && t2_value !== (t2_value = /*e*/ ctx[21].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*enfants*/ 4 && t4_value !== (t4_value = new Date(/*e*/ ctx[21].dateBirth).toLocaleDateString('fr-FR') + "")) set_data_dev(t4, t4_value);

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button2, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(171:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (157:24) {#if toUpdates[e.id]}
    function create_if_block_1(ctx) {
    	let tr;
    	let td0;
    	let input0;
    	let t0;
    	let td1;
    	let input1;
    	let t1;
    	let td2;
    	let input2;
    	let t2;
    	let td3;
    	let button0;
    	let i0;
    	let t3;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[14].call(input0, /*e*/ ctx[21]);
    	}

    	function input1_input_handler() {
    		/*input1_input_handler*/ ctx[15].call(input1, /*e*/ ctx[21]);
    	}

    	function input2_input_handler() {
    		/*input2_input_handler*/ ctx[16].call(input2, /*e*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t0 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t1 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t2 = space();
    			td3 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t3 = space();
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file, 158, 32, 5030);
    			add_location(td0, file, 158, 28, 5026);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file, 159, 32, 5127);
    			add_location(td1, file, 159, 28, 5123);
    			attr_dev(input2, "type", "date");
    			add_location(input2, file, 160, 32, 5219);
    			add_location(td2, file, 160, 28, 5215);
    			attr_dev(i0, "class", "fa fa-check");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file, 163, 36, 5465);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success btn-sm");
    			add_location(button0, file, 162, 32, 5349);
    			attr_dev(i1, "class", "fa fa-times");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file, 166, 36, 5698);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-dark btn-sm");
    			add_location(button1, file, 165, 32, 5586);
    			add_location(td3, file, 161, 28, 5312);
    			add_location(tr, file, 157, 24, 4989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].firstName);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].name);
    			append_dev(tr, t1);
    			append_dev(tr, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].dateBirth);
    			append_dev(tr, t2);
    			append_dev(tr, td3);
    			append_dev(td3, button0);
    			append_dev(button0, i0);
    			append_dev(td3, t3);
    			append_dev(td3, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler),
    					listen_dev(input1, "input", input1_input_handler),
    					listen_dev(input2, "input", input2_input_handler),
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*confirmEdit*/ ctx[11](/*e*/ ctx[21]))) /*confirmEdit*/ ctx[11](/*e*/ ctx[21]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*cancelEdit*/ ctx[10](/*e*/ ctx[21]))) /*cancelEdit*/ ctx[10](/*e*/ ctx[21]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*toUpdates, enfants*/ 12 && input0.value !== /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].firstName) {
    				set_input_value(input0, /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].firstName);
    			}

    			if (dirty & /*toUpdates, enfants*/ 12 && input1.value !== /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].name) {
    				set_input_value(input1, /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].name);
    			}

    			if (dirty & /*toUpdates, enfants*/ 12) {
    				set_input_value(input2, /*toUpdates*/ ctx[3][/*e*/ ctx[21].id].dateBirth);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(157:24) {#if toUpdates[e.id]}",
    		ctx
    	});

    	return block;
    }

    // (188:36) {:else}
    function create_else_block_1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-caret-down");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file, 188, 36, 6948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(188:36) {:else}",
    		ctx
    	});

    	return block;
    }

    // (186:36) {#if e.dropped}
    function create_if_block_2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-caret-up");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file, 186, 36, 6818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(186:36) {#if e.dropped}",
    		ctx
    	});

    	return block;
    }

    // (195:24) {#if e.dropped && e.activites.length > 0}
    function create_if_block$1(ctx) {
    	let tr;
    	let table;
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let each_value_1 = /*e*/ ctx[21].activites;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Titre";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Description";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Début";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Fin";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file, 198, 36, 7423);
    			add_location(th1, file, 199, 36, 7474);
    			add_location(th2, file, 200, 36, 7531);
    			add_location(th3, file, 201, 36, 7582);
    			add_location(th4, file, 202, 36, 7631);
    			add_location(thead, file, 197, 32, 7379);
    			add_location(tbody, file, 204, 32, 7720);
    			attr_dev(table, "class", "table table-bordered table-sm");
    			add_location(table, file, 196, 28, 7301);
    			add_location(tr, file, 195, 24, 7268);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(thead, t3);
    			append_dev(thead, th2);
    			append_dev(thead, t5);
    			append_dev(thead, th3);
    			append_dev(thead, t7);
    			append_dev(thead, th4);
    			append_dev(table, t9);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*desinscrire, enfants, Date*/ 8196) {
    				each_value_1 = /*e*/ ctx[21].activites;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(195:24) {#if e.dropped && e.activites.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (206:36) {#each e.activites as a}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*a*/ ctx[24].titre + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*a*/ ctx[24].description + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = new Date(/*a*/ ctx[24].dateDebut).toLocaleDateString('fr-FR') + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = new Date(/*a*/ ctx[24].dateFin).toLocaleDateString('fr-FR') + "";
    	let t6;
    	let t7;
    	let td4;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button = element("button");
    			i = element("i");
    			add_location(td0, file, 207, 40, 7892);
    			add_location(td1, file, 208, 40, 7951);
    			add_location(td2, file, 209, 40, 8016);
    			add_location(td3, file, 210, 40, 8119);
    			attr_dev(i, "class", "fa fa-times");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file, 213, 48, 8399);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger btn-sm");
    			add_location(button, file, 212, 44, 8269);
    			add_location(td4, file, 211, 40, 8220);
    			attr_dev(tr, "class", "table-primary");
    			add_location(tr, file, 206, 36, 7825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*desinscrire*/ ctx[13](/*e*/ ctx[21], /*a*/ ctx[24]))) /*desinscrire*/ ctx[13](/*e*/ ctx[21], /*a*/ ctx[24]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*enfants*/ 4 && t0_value !== (t0_value = /*a*/ ctx[24].titre + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*enfants*/ 4 && t2_value !== (t2_value = /*a*/ ctx[24].description + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*enfants*/ 4 && t4_value !== (t4_value = new Date(/*a*/ ctx[24].dateDebut).toLocaleDateString('fr-FR') + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*enfants*/ 4 && t6_value !== (t6_value = new Date(/*a*/ ctx[24].dateFin).toLocaleDateString('fr-FR') + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(206:36) {#each e.activites as a}",
    		ctx
    	});

    	return block;
    }

    // (156:24) {#each enfants as e}
    function create_each_block(ctx) {
    	let t;
    	let if_block1_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*toUpdates*/ ctx[3][/*e*/ ctx[21].id]) return create_if_block_1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*e*/ ctx[21].dropped && /*e*/ ctx[21].activites.length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			}

    			if (/*e*/ ctx[21].dropped && /*e*/ ctx[21].activites.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(156:24) {#each enfants as e}",
    		ctx
    	});

    	return block;
    }

    // (145:12) <Route path="enfants" primary={false}>
    function create_default_slot_2(ctx) {
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let t8;
    	let tr1;
    	let td0;
    	let input0;
    	let t9;
    	let td1;
    	let input1;
    	let t10;
    	let td2;
    	let input2;
    	let t11;
    	let td3;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*enfants*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Prénom";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Nom";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Date de naissance";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Actions";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t9 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t10 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t11 = space();
    			td3 = element("td");
    			button = element("button");
    			button.textContent = "Ajouter";
    			add_location(th0, file, 148, 28, 4630);
    			add_location(th1, file, 149, 28, 4674);
    			add_location(th2, file, 150, 28, 4715);
    			add_location(th3, file, 151, 28, 4770);
    			add_location(tr0, file, 147, 24, 4597);
    			add_location(thead, file, 146, 20, 4565);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Prénom");
    			add_location(input0, file, 226, 32, 8865);
    			add_location(td0, file, 226, 28, 8861);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Nom");
    			add_location(input1, file, 227, 32, 8974);
    			add_location(td1, file, 227, 28, 8970);
    			attr_dev(input2, "type", "date");
    			attr_dev(input2, "placeholder", "Date de naissance");
    			add_location(input2, file, 228, 32, 9075);
    			add_location(td2, file, 228, 28, 9071);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file, 229, 32, 9195);
    			add_location(td3, file, 229, 28, 9191);
    			add_location(tr1, file, 225, 24, 8828);
    			add_location(tbody, file, 154, 20, 4866);
    			attr_dev(table, "class", "table table-striped table-hover");
    			add_location(table, file, 145, 16, 4497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t8);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*inputs*/ ctx[5].firstName);
    			append_dev(tr1, t9);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*inputs*/ ctx[5].name);
    			append_dev(tr1, t10);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*inputs*/ ctx[5].dateBirth);
    			append_dev(tr1, t11);
    			append_dev(tr1, td3);
    			append_dev(td3, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[17]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[18]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[19]),
    					listen_dev(button, "click", /*ajouterEnfant*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*enfants, desinscrire, Date, cancelEdit, confirmEdit, toUpdates, showActivitesEnfant, updateEnfant, deleteEnfant*/ 16140) {
    				each_value = /*enfants*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, t8);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*inputs*/ 32 && input0.value !== /*inputs*/ ctx[5].firstName) {
    				set_input_value(input0, /*inputs*/ ctx[5].firstName);
    			}

    			if (dirty & /*inputs*/ 32 && input1.value !== /*inputs*/ ctx[5].name) {
    				set_input_value(input1, /*inputs*/ ctx[5].name);
    			}

    			if (dirty & /*inputs*/ 32) {
    				set_input_value(input2, /*inputs*/ ctx[5].dateBirth);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(145:12) <Route path=\\\"enfants\\\" primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (236:12) <Route path={settings.route} primary={false}>
    function create_default_slot_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*settings*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*settings*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(236:12) <Route path={settings.route} primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (105:4) <Router>
    function create_default_slot(ctx) {
    	let nav;
    	let div1;
    	let span0;
    	let t1;
    	let button;
    	let span1;
    	let t2;
    	let div0;
    	let ul0;
    	let li0;
    	let link0;
    	let t3;
    	let li1;
    	let link1;
    	let t4;
    	let li2;
    	let link2;
    	let t5;
    	let ul1;
    	let li3;
    	let link3;
    	let t6;
    	let li4;
    	let link4;
    	let t7;
    	let main;
    	let route0;
    	let t8;
    	let route1;
    	let t9;
    	let route2;
    	let t10;
    	let route3;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "activites",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "enfants",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: /*settings*/ ctx[0].route,
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4.$on("click", function () {
    		if (is_function(/*logout*/ ctx[1])) /*logout*/ ctx[1].apply(this, arguments);
    	});

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				primary: false,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "activites",
    				primary: false,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "enfants",
    				primary: false,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: /*settings*/ ctx[0].route,
    				primary: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Centre Périscolaire";
    			t1 = space();
    			button = element("button");
    			span1 = element("span");
    			t2 = space();
    			div0 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t3 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t4 = space();
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t5 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			create_component(link3.$$.fragment);
    			t6 = space();
    			li4 = element("li");
    			create_component(link4.$$.fragment);
    			t7 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t8 = space();
    			create_component(route1.$$.fragment);
    			t9 = space();
    			create_component(route2.$$.fragment);
    			t10 = space();
    			create_component(route3.$$.fragment);
    			attr_dev(span0, "class", "navbar-brand");
    			add_location(span0, file, 107, 16, 2653);
    			attr_dev(span1, "class", "navbar-toggler-icon");
    			add_location(span1, file, 109, 20, 2948);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarSupportedContent");
    			attr_dev(button, "aria-controls", "navbarSupportedContent");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file, 108, 16, 2723);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 113, 24, 3175);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 116, 24, 3321);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file, 119, 24, 3480);
    			attr_dev(ul0, "class", "navbar-nav me-auto");
    			add_location(ul0, file, 112, 20, 3119);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file, 124, 24, 3717);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file, 127, 24, 3888);
    			attr_dev(ul1, "class", "navbar-nav ms-auto");
    			add_location(ul1, file, 123, 20, 3661);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarSupportedContent");
    			add_location(div0, file, 111, 16, 3032);
    			attr_dev(div1, "class", "container-fluid");
    			add_location(div1, file, 106, 12, 2607);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-dark bg-dark");
    			add_location(nav, file, 105, 8, 2537);
    			attr_dev(main, "class", "container");
    			add_location(main, file, 135, 8, 4127);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, button);
    			append_dev(button, span1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul0, t4);
    			append_dev(ul0, li2);
    			mount_component(link2, li2, null);
    			append_dev(div0, t5);
    			append_dev(div0, ul1);
    			append_dev(ul1, li3);
    			mount_component(link3, li3, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li4);
    			mount_component(link4, li4, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t8);
    			mount_component(route1, main, null);
    			append_dev(main, t9);
    			mount_component(route2, main, null);
    			append_dev(main, t10);
    			mount_component(route3, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 134217728) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 134217728) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 134217728) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};
    			if (dirty & /*settings*/ 1) link3_changes.to = /*settings*/ ctx[0].route;

    			if (dirty & /*$$scope, settings*/ 134217729) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 134217728) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope, $userConnected*/ 134217792) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, activites, enfants*/ 134217748) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, inputs, enfants, toUpdates*/ 134217772) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};
    			if (dirty & /*settings*/ 1) route3_changes.path = /*settings*/ ctx[0].route;

    			if (dirty & /*$$scope, settings*/ 134217729) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(105:4) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			add_location(div, file, 103, 0, 2510);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, settings, inputs, enfants, toUpdates, activites, $userConnected, logout*/ 134217855) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $userConnected;
    	validate_store(userConnected, 'userConnected');
    	component_subscribe($$self, userConnected, $$value => $$invalidate(6, $userConnected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Parent', slots, []);
    	let { settings } = $$props;
    	let { logout } = $$props;
    	let enfants = [];
    	let toUpdates = {};
    	let activites = [];
    	const inputs = { firstName: "", name: "", dateBirth: "" };

    	onMount(async () => {
    		$$invalidate(2, enfants = await getEnfantsParent($userConnected.id));
    		$$invalidate(4, activites = await getActivites());
    	});

    	async function ajouterEnfant() {
    		const enfant = await addEnfant($userConnected.id, inputs);

    		if (enfant.error) ; else {
    			$$invalidate(2, enfants = [...enfants, enfant]); //
    		}
    	}

    	async function deleteEnfant(e) {
    		const res = await removeEnfant(e.id);

    		if (res.error) ; else {
    			$$invalidate(2, enfants = enfants.filter(({ id }) => id !== e.id)); //
    		}
    	}

    	function updateEnfant(e) {
    		$$invalidate(3, toUpdates = { ...toUpdates, [e.id]: e });
    	}

    	function cancelEdit(e) {
    		_removeFromUpdates(e);
    	}

    	function _removeFromUpdates({ id }) {
    		const copy = { ...toUpdates };
    		delete copy[id];
    		$$invalidate(3, toUpdates = { ...copy });
    	}

    	async function confirmEdit(e) {
    		const enfant = toUpdates[e.id];
    		const res = await editEnfant(enfant);

    		if (res.error) ; else {
    			_removeFromUpdates(e); //
    		}
    	}

    	async function showActivitesEnfant(e) {
    		if (e.dropped) {
    			delete e.dropped;
    		} else {
    			e.dropped = true;
    			const res = await getActivitesEnfant(e.id);

    			if (res.error) {
    				console.log(res.error);
    			} else {
    				e.activites = res;
    			}
    		}

    		$$invalidate(2, enfants = [...enfants]);
    	}

    	async function desinscrire(enfant, activite) {
    		const res = await desinscrireEnfant(activite, enfant);

    		if (res.error) {
    			console.log(error);
    		} else {
    			enfant.activites = enfant.activites.filter(({ id }) => id !== activite.id);
    			$$invalidate(2, enfants = [...enfants]);
    		}
    	}

    	const writable_props = ['settings', 'logout'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Parent> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler(e) {
    		toUpdates[e.id].firstName = this.value;
    		$$invalidate(3, toUpdates);
    	}

    	function input1_input_handler(e) {
    		toUpdates[e.id].name = this.value;
    		$$invalidate(3, toUpdates);
    	}

    	function input2_input_handler(e) {
    		toUpdates[e.id].dateBirth = this.value;
    		$$invalidate(3, toUpdates);
    	}

    	function input0_input_handler_1() {
    		inputs.firstName = this.value;
    		$$invalidate(5, inputs);
    	}

    	function input1_input_handler_1() {
    		inputs.name = this.value;
    		$$invalidate(5, inputs);
    	}

    	function input2_input_handler_1() {
    		inputs.dateBirth = this.value;
    		$$invalidate(5, inputs);
    	}

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('logout' in $$props) $$invalidate(1, logout = $$props.logout);
    	};

    	$$self.$capture_state = () => ({
    		settings,
    		logout,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		onMount,
    		api,
    		userConnected,
    		Activites,
    		Welcome,
    		desinscrireEnfant,
    		getActivites,
    		addEnfant,
    		editEnfant,
    		getActivitesEnfant,
    		getEnfantsParent,
    		removeEnfant,
    		enfants,
    		toUpdates,
    		activites,
    		inputs,
    		ajouterEnfant,
    		deleteEnfant,
    		updateEnfant,
    		cancelEdit,
    		_removeFromUpdates,
    		confirmEdit,
    		showActivitesEnfant,
    		desinscrire,
    		$userConnected
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('logout' in $$props) $$invalidate(1, logout = $$props.logout);
    		if ('enfants' in $$props) $$invalidate(2, enfants = $$props.enfants);
    		if ('toUpdates' in $$props) $$invalidate(3, toUpdates = $$props.toUpdates);
    		if ('activites' in $$props) $$invalidate(4, activites = $$props.activites);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		logout,
    		enfants,
    		toUpdates,
    		activites,
    		inputs,
    		$userConnected,
    		ajouterEnfant,
    		deleteEnfant,
    		updateEnfant,
    		cancelEdit,
    		confirmEdit,
    		showActivitesEnfant,
    		desinscrire,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1
    	];
    }

    class Parent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { settings: 0, logout: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Parent",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
    			console_1.warn("<Parent> was created without expected prop 'settings'");
    		}

    		if (/*logout*/ ctx[1] === undefined && !('logout' in props)) {
    			console_1.warn("<Parent> was created without expected prop 'logout'");
    		}
    	}

    	get settings() {
    		throw new Error("<Parent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Parent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logout() {
    		throw new Error("<Parent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logout(value) {
    		throw new Error("<Parent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Index.svelte generated by Svelte v3.47.0 */

    // (20:0) {:else}
    function create_else_block(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(20:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#if $userConnected}
    function create_if_block(ctx) {
    	let home;
    	let current;

    	home = new Home({
    			props: {
    				type: /*types*/ ctx[1][/*$userConnected*/ ctx[0].discriminatorValue]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const home_changes = {};
    			if (dirty & /*$userConnected*/ 1) home_changes.type = /*types*/ ctx[1][/*$userConnected*/ ctx[0].discriminatorValue];
    			home.$set(home_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(18:0) {#if $userConnected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$userConnected*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $userConnected;
    	validate_store(userConnected, 'userConnected');
    	component_subscribe($$self, userConnected, $$value => $$invalidate(0, $userConnected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index', slots, []);

    	const types = {
    		"1": Mairie,
    		"2": Periscolaire,
    		"3": Parent
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userConnected,
    		Home,
    		Login,
    		Mairie,
    		Periscolaire,
    		Parent,
    		types,
    		$userConnected
    	});

    	return [$userConnected, types];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.47.0 */

    function create_fragment(ctx) {
    	let index;
    	let current;
    	index = new Index({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(index.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(index, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(index.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(index.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(index, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Index });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
