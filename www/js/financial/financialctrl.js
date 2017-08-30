angular.module('ssapp.controllers')
.controller('finacialCtrl',function($scope, $state, $timeout){
	$scope.$on($state.current.name + "-init", function() {
		var data=
		[
			{title:'库存现金',money:18012.45},
			{title:'银行存款',money:19053769.68},
			{title:'应收账款',money:46404438.21},
			{title:'应付账款',money:28690697.25}
		];
		 var circledata=['成本明细','资产明细','负债明细'];
		 var dataschart=['container0','container1','container2','container3'];
		 var objs={
		 	olds:[
		 		[2.023522, 2.856439, 4.260673, 2.419249, 1.916027, 4.507466,4.551822, 1.060998, 2.130191, 2.578719, 1.468162, 2.027673],
		 		[3890.023822,4285.657439,5266.856477,6772.856488,7011.574123,5672.856433,7231.821339,5237.489943,6512.872239,6342.856445,6745.355643,7752.212765],
		 		[1869.069784,2222.114851,2733.451781,1955.414242,2344.111845,2155.675532,2081.369922,2955.744111,1920.117711,2411.117722,2366.118881,2211.553320],
		 		[2400.154671,2711.446760,2102.224853,2220.332548,2936.114561,2732.145216,2836.511451,1919.555151,2712.146873,1966.154632,2931.882431,3066.113852]
		 	],
			news:[
				[2.462422, 7.046171, 2.894648, 4.760144, 2.447044, 5.689536,2.311110, 1.605631, 8.272791, 1.518255, 2.871895, 4.891002],
				[5890.027722,6285.652139,7266.856547,5772.812488,6011.500263,6545.859033,5964.891339,7534.800439,7012.822239,6742.859945,6905.379943,7800.200765],
				[1911.061120,2511.717801,2533.442201,2474.425692,2384.115545,2411.600542,2301.245902,2255.224992,2220.492771,2123.992544,2101.752204,2001.012207],
				[3001.882317,2931.127609,2822.272112,2527.772278,2350.185613,2732.182168,2122.245872,2705.881516,2379.155371,2306.248278,2533.243134,2766.120427]
			]
		};
		var zcdata=[
						[
						    ['直接材料',47.55],
						    ['生产成本',45.57],
						    ['直接人工',1.53],
						    ['制造费用',2.31],
						    ['管理费用',0.8],
						    ['结转费用', 0.13]
						],
						[
						    ['原材料',32.25],
						    ['银行存款',25.19],
						    ['固定资产',12.87],
						    ['应收',7.36],
						    ['累计折旧',5.61],
						    ['其他', 16.72]
						],
						[
						    ['长期借款',23.67],
						    ['短期借款',14.80],
						    ['应付材料',11.37],
						    ['应付薪酬',10.66],
						    ['应付账款',6.25],
						    ['应付利息', 3.12],
						    ['预收账款',2.54],
						    ['应缴税费',2.54],
						    ['其他',25.59]

						]

			        ]
		 $scope.data=data;
		 var myfn=function(){
		 	for(let i=0;i<dataschart.length;i++){
		 		$('#container'+i).highcharts({
				    chart:{type:'spline'},
				    colors:['#8085e9','#f45b5b'],
				    title:{text: ''},
				    subtitle: {text: ''},
				    legend:{layout: 'horizontal',align: 'center',verticalAlign: 'bottom',borderWidth: 0},
				    xAxis:{
				    	categories:['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
				        tickmarkPlacement:'on',
				        tickWidth: 1,
		    		},  
				    yAxis: [
					    {
					    	endOnTick:false,
					        title: {
					            text:'金额'
					        },
					        labels: {
							    formatter:function(){
							        return (this.value)+"万";
							    }
							}
					    }
				    ],
				    tooltip: {
				        shared: true,
				        crosshairs: true,
				        pointFormatter: function() {
					    			return '<span style="color:'+this.series.color+'"></span> '+
					           		this.series.name+':<b>'+((this.y)*10000).toFixed(2)+'元</b><br/>'
						}
					},	
					plotOptions:{
							series:{
								marker: {
									enabled:false,
									lineWidth: 1,
									radius: 1.5,
									lineColor:null,
									symbol: 'circle',
									states: {
										hover: {
											// enabled: false
							                   }
						                },				        
									spline: {
										lineWidth:1,
										marker: {
											 enabled:false
											    }
										}
								   }
								}
							},
					series:[
								{
							        name: '2015年',
							        data: objs.olds[i]
								},
								{
							        name: '2016年',
							        data: objs.news[i]
								}
							]		
				});
				if(i+4>6){return};
				$('#container'+(i+4)).highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: null,
			            plotShadow: false,
			            spacing : [0, 0 , 0, 0]
			        },
			        title: {
			            floating:true,
			            text: circledata[i]
			        },
			        tooltip: {
			            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			        },
			        plotOptions: {
			            pie: {
			                allowPointSelect: true,
			                cursor: 'pointer',
			                dataLabels: {
			                    enabled: false,
			                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
			                    style: {
			                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			                    }
			                },
			            }
			        },
			        series: [{
			            type: 'pie',
			            innerSize: '50%',
			            name: '明细情况',
			            data:zcdata[i]
			        }]
			    	}, function(c) {
			        // 环形图圆心
			        var centerY = c.series[0].center[1],
			            titleHeight = parseInt(c.title.styles.fontSize);
			        c.setTitle({
			            y:centerY + titleHeight/2
			        });
			        chart = c;
			    });
			    setTimeout(function() {
			    	$(".spinner-calm").hide();
				 	$("ion-scroll").show();
				 	$(".cwgl-number").show();
				 	$("p").show();
					$(".gzq_fenge").show();
			    });
		 	};
		};
		setTimeout(myfn,50);
	});
			
})