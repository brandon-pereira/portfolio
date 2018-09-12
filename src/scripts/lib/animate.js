/**
 * Function to call the native Element.animate function.
 * Only fires if the animate feature is supported... if you're
 * wanting to use this you should use a polyfill for unsupported
 * browsers.
 * @param  {Element} el Element to call .animate on.
 * @param  {Options} args Arguments to be sent directly to Element.animate.
 * @return {Element}
 */
export default (el, transition, opts, cb) => {
	if(el && el instanceof NodeList) {
		el.forEach((el, i) => {
			const _opts = Object.assign({}, opts, {
				delay: typeof opts.iterationDelay === 'function' ? opts.iterationDelay(i) : 0
			})
			animate(el, transition, _opts, cb);
		})
	} else {
		animate(el, transition, opts, cb);
	}
}

const animate = (el, transition, opts, cb) => {
	if (el && 'animate' in el) {
		const animation = el.animate(transition, opts)
		animation.onfinish = cb;
		return animation;
	} else if (cb) {
		cb(); // dont animate just call callback
	}
}
