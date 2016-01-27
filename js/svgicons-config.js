var svgIconConfig = {
	navUpArrow : {
		url : 'svg/nav-up-arrow.svg',
		animation : [
			{
				el : 'path',
				animProperties : {
					from : { val : '{"path" : "M 9.8831175,48.502029 31.978896,15.316152 54.116883,48.502029"}' },
					to : { val : '{"path" : "M 9.8831175,15.316152 31.978896,48.502029 54.116883,15.316152"}' }
				}
			}
		]
	},
	play : {
		url : 'svg/play.svg',
		animation : [
			{
				el : 'path',
				animProperties : {
					from : { val : '{"path" : "M 18.741071,52 31.30178,42.531655 45.258928,31.887987 18.741071,12 z"}', delayFactor : 0 },
					to : { val : '{"path" : "m 12.5,52 39,0 0,-40 -39,0 z"}' , delayFactor : 0}
				}
			}
		]
	}
};
