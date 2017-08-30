angular.module('ssapp.controllers')
.controller('salemanagectrl',function($scope, $state, commonService){
	$scope.$on($state.current.name + "-init", function() {
		setTimeout(function(){
			$('#container0').highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: null,
			            plotShadow: false,
			            spacing : [0, 0 , 0, 0]
			        },
			        title: {
			            floating:true,
			            text: '客户行业',
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
			            data: [
			                ['化工',33.33],
			                ['外贸',13.33],
			                ['石油',13.33],
			                ['造船',13.33],
			                ['医药',12.27],
			                ['动车',13.71],
			                ['其他', 0.7]
			            ]
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
			$('#container1').highcharts({
				    chart:{type:'spline'},
				    colors:['#8085e9','#f45b5b'],
				    title:{text: ''},
				    subtitle: {text: ''},
				    legend:{layout: 'horizontal',align: 'center',verticalAlign: 'bottom',borderWidth: 0,enabled:false},
				    xAxis:{
				    	categories:[
				    	'2017年5月01日', '2017年5月02日', '2017年5月03日', '2017年5月04日', '2017年5月05日', 
				    	'2017年5月06日', '2017年5月07日', '2017年5月08日', '2017年5月09日', '2017年5月10日', 
				    	'2017年5月11日', '2017年5月12日', '2017年5月13日', '2017年5月14日', '2017年5月15日',
				    	'2017年5月16日', '2017年5月17日', '2017年5月18日', '2017年5月19日', '2017年5月20日'
				    	],
				        tickmarkPlacement:'on',
				         // tickmarkPlacement: 'between',
				        tickWidth:0,
			            labels: {
			                step: 17
			            }
		    		},  
				    yAxis: [
					    {
					    	endOnTick:false,
					        title: {
					            text:'拜访次数'
					        },
					        labels: {
							    formatter:function(){
							        return (this.value)+"次";
							    }
							}
					    }
				    ],
				    tooltip: {
				        shared: true,
				        crosshairs: true,
				        pointFormatter: function() {
					    			return '<span style="color:'+this.series.color+'"></span> '+
					           		this.series.name+':<b>'+(this.y)+'次</b><br/>'
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
							        name: '2017年',
							        data: [2, 2, 2, 1, 1, 1,4, 6, 2, 1, 4, 8,2,2,8,4,2,3,2,6]
								}
							]		
				});
			$('#container2').highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            type: 'category',
		            labels: {
		                rotation: 0,
		                style: {
		                    fontSize: '13px',
		                    fontFamily: 'Verdana, sans-serif'
		                },
		                step:2,
		            },
		             tickWidth: 0,
		        },
		        yAxis: {
		            min: 0,
		            endOnTick:false,
		            title: {
		                text: '数量 (家)'
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        tooltip: {
		            pointFormat: '跟进数量: <b>{point.y} 家</b>'
		        },
		        series: [{
		            name: '行业数量',
		            data: [
		                    ['化工',15],
			                ['外贸',6],
			                ['石油',6],
			                ['造船',6],
			                ['医药',4],
			                ['动车',4],
			                ['其他',2]
		                

		                    
		            ],
		            dataLabels: {
		                enabled: true,
		                rotation:45,
		                color: 'black',
		                align: 'center',
		                // format: '{point.y:.1f}', // one decimal
		                y: 20, // 10 pixels down from the top
		                style: {
		                    fontSize: '10px',
		                    fontFamily: 'Verdana, sans-serif'
		                }
		            }
		        }]
	    		});
			$('#container3').highcharts({
		        chart: {
		            type: 'bar'
		        },
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            categories: ['宋炜炜', '陈龙', '宋彩虹', '蔡守非', '马旺','舒欢','郭明','康赞'],
		            title: {
		                text: null
		            },
		            tickWidth: 0,
		        },
		        yAxis: {
		            min: 0,
		            title: {
		           
		                text: '次数（次）'
		      
		            },
		            labels: {
		                overflow: 'justify',
		            },
		            endOnTick:false
		        },
		        tooltip: {
		            valueSuffix: '次'
		        },
		        plotOptions: {
		            bar: {
		                dataLabels: {
		                    enabled: false,
		                    allowOverlap: true
		                }
		            }
		        },
		        legend: {
		            enabled:false,
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'top',
		            x: -40,
		            y: 100,
		            floating: true,
		            borderWidth: 1,
		            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		            shadow: true
		        },
		        credits: {
		            enabled: false
		        },
		        series: [{
		            name: '2017 年',
		            data: [8, 7, 6, 6,5,5,5,2]
		        }]
		    	});
			Highcharts.chart('container4', {
				    chart: {
				        type: 'solidgauge',
				        marginTop:0
				    },
				    credits: {
				        enabled:false,
				    },
				    title: {
				        text: ''
				    },
				    tooltip: {
				    	enabled:false,
				        borderWidth:0,
				        backgroundColor: '#fcbdd1',
				        shadow: false,
				        // borderRadius:100,
				        style: {
				            fontSize: '20px',
				        },
				        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
				        positioner: function (labelWidth, labelHeight) {
				            return {
				                x: 200 - labelWidth / 2,
				                y: 180
				            };
				        }
				    },
				    pane: {
				        startAngle: -140,
				        endAngle: 22,
				        background: [{ // Track for Move
				            outerRadius: '112%',
				            innerRadius: '88%',
				            backgroundColor: Highcharts.Color('#F62366').setOpacity(0.3).get(),
				            borderWidth: 0
				        }]
				    },
				    yAxis: {
				        min: 0,
				        max: 100,
				        lineWidth: 1,
				        tickPositions: []
				    },
				    plotOptions: {
				        solidgauge: {
				            borderWidth: '38px',
				            dataLabels: {
				                enabled: true,
				                backgroundColor: '#fcbdd1',
				                borderWidth:0,
				                // format: ' %',
				                format:'{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>'
				            },
				            linecap: 'round',
				            stickyTracking: false
				        }
				    },
				    lendged:{
				    },
				    series: [{
				        name: '达标比例',
				        borderColor: '#F62366',
				        data: [{
				            color: '#F62366',
				            radius: '100%',
				            innerRadius: '100%',
				            y: 45
				        }]
				    }]
				});
			$('#container2_1').highcharts({
		        chart: {
		            type: 'bar'
		        },
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            categories:['一部', '二部', '三部', '四部', '五部'],
		            title: {
		                text: null
		            },
		            tickWidth: 0,
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: '金额（万）'
		            },
		            labels: {
		                overflow: 'justify',
		            },
		            endOnTick:false,
		            format: '{point.y}万'

		        },
		        tooltip: {
		            valueSuffix: '万'
		        },
		        plotOptions: {
		            bar: {
		                dataLabels: {
		                    enabled: false,
		                    allowOverlap: true
		                }
		            }
		        },
		        legend: {
		            enabled:false,
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'top',
		            x: -40,
		            y: 100,
		            floating: true,
		            borderWidth: 1,
		            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		            shadow: true
		        },
		        credits: {
		            enabled: false
		        },
		        series: [{
		            name: '2017 年',
		            data: [2352,3485,4469,3749,617]
		        }]
		    	});
			$('#container2_2').highcharts({
		        chart: {
		            type: 'bar'
		        },
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            categories:  ['宋炜炜', '陈龙', '宋彩虹', '蔡守非', '马旺','舒欢','郭明','康赞'],
		            title: {
		                text: null
		            },
		            tickWidth: 0,
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            },
		            labels: {
		                overflow: 'justify',
		            },
		            endOnTick:false
		            
		        },
		        tooltip: {
		            valueSuffix: '万'
		        },
		        plotOptions: {
		            bar: {
		                dataLabels: {
		                    enabled: false,
		                    allowOverlap: true
		                }
		            }
		        },
		        legend: {
		            enabled:false,
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'top',
		            x: -40,
		            y: 100,
		            floating: true,
		            borderWidth: 1,
		            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		            shadow: true
		        },
		        credits: {
		            enabled: false
		        },
		        series: [{
		            name: '2017 年',
		            data: [120,150,143,96.5,85.7,200,186,151]
		        }]
		    	});
			$('#container2_3').highcharts({
		        chart: {
		            type: 'bar'
		        },
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            categories: ['新和成药业', '扬子石化', '舟山新地能源', '内蒙古伊品生物', '贵州化工建设公司','中海福陆','安徽中粮','上海江南船舶管业','安德里茨','青岛达能'],
		            title: {
		                text: null
		            },
		            tickWidth: 0,
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            },
		            labels: {
		                overflow: 'justify',
		            },
		            endOnTick:false
		        },
		        tooltip: {
		            valueSuffix: '万'
		        },
		        plotOptions: {
		            bar: {
		                dataLabels: {
		                    enabled: false,
		                    allowOverlap: true
		                }
		            }
		        },
		        legend: {
		            enabled:false,
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'top',
		            x: -40,
		            y: 100,
		            floating: true,
		            borderWidth: 1,
		            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		            shadow: true
		        },
		        credits: {
		            enabled: false
		        },
		        series: [{
		            name: '2017年',
		            data: [256,92,143,112,200,125,623,199,456,221]
		        }]
		    	});
			$('#container2_4').highcharts({
				    chart:{type:'spline'},
				    credits: {
	          				enabled: false
	       					 },
				    colors:['#8085e9','#f45b5b'],
				    title:{text: ''},
				    subtitle: {text: ''},
				    legend:{layout: 'horizontal',align: 'center',verticalAlign: 'bottom',borderWidth: 0,enabled:false},
				    xAxis:{
				    	categories:[
				    	'2017年5月01日', '2017年5月02日', '2017年5月03日', '2017年5月04日', '2017年5月05日', 
				    	'2017年5月06日', '2017年5月07日', '2017年5月08日', '2017年5月09日', '2017年5月10日', 
				    	'2017年5月11日', '2017年5月12日', '2017年5月13日', '2017年5月14日', '2017年5月15日',
				    	'2017年5月16日', '2017年5月17日', '2017年5月18日', '2017年5月19日', '2017年5月20日'
				    	],
				        tickmarkPlacement:'on',
				         // tickmarkPlacement: 'between',
				        tickWidth:0,
			            labels: {
			                step: 17
			            }
		    		},  
				    yAxis: [
					    {
					    	endOnTick:false,
					        title: {
					            text:'销售金额'
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
					           		this.series.name+':<b>'+(this.y)+'万元</b><br/>'
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
							        name: '2017年',
							        data: [50, 42, 67, 36, 25, 20,36, 49, 52, 67, 41, 56,98,100,120,100,20,98,121,109]
							        
								}
							]		
				});
			$('#container2_5').highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: null,
			            plotShadow: false,
			            spacing : [0, 0 , 0, 0]
			        },
			        title: {
			            floating:true,
			            text: '商品分类',
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
			            data: [
			                ['换热器管',5.6],
			                ['动车刹车管',6.8],
			                ['食品级管道',12.8],
			                ['石油化工管道',38.5],
			                ['医药用管',16.2],
			                ['贸易管道', 10.1],
			                ['其他',10]
			            ]
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
			// $('#container2_6').highcharts({
			//         chart: {
			//             plotBackgroundColor: null,
			//             plotBorderWidth: null,
			//             plotShadow: false,
			//             spacing : [0, 0 , 0, 0]
			//         },
			//         title: {
			//             floating:true,
			//             text: '客户行业',
			//         },
			//         tooltip: {
			//             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			//         },
			//         plotOptions: {
			//             pie: {
			//                 allowPointSelect: true,
			//                 cursor: 'pointer',
			//                 dataLabels: {
			//                     enabled: false,
			//                     format: '<b>{point.name}</b>: {point.percentage:.1f} %',
			//                     style: {
			//                         color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			//                     }
			//                 },
			//             }
			//         },
			//         series: [{
			//             type: 'pie',
			//             innerSize: '50%',
			//             name: '明细情况',
			//             data: [
			//                 ['Firefox',45.0],
			//                 ['IE',26.8],
			//                 ['Chrome',12.8],
			//                 ['Safari',8.5],
			//                 ['Opera',6.2],
			//                 ['其他', 0.7]
			//             ]
			//         }]
			//     	}, function(c) {
			//         // 环形图圆心
			//         var centerY = c.series[0].center[1],
			//             titleHeight = parseInt(c.title.styles.fontSize);
			//         c.setTitle({
			//             y:centerY + titleHeight/2
			//         });
			//         chart = c;
			//     });
			Highcharts.chart('container3_1', {
				    chart: {
				        type: 'solidgauge',
				        marginTop:0
				    },
				    credits: {
				        enabled:false,
				    },
				    title: {
				        text: ''
				    },
				    tooltip: {
				    	enabled:false,
				        borderWidth:0,
				        backgroundColor: '#fcbdd1',
				        shadow: false,
				        // borderRadius:100,
				        style: {
				            fontSize: '20px',
				        },
				        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
				        positioner: function (labelWidth, labelHeight) {
				            return {
				                x: 200 - labelWidth / 2,
				                y: 180
				            };
				        }
				    },
				    pane: {
				        startAngle: -140,
				        endAngle: 22,
				        background: [{ // Track for Move
				            outerRadius: '112%',
				            innerRadius: '88%',
				            backgroundColor: Highcharts.Color('#F62366').setOpacity(0.3).get(),
				            borderWidth: 0
				        }]
				    },
				    yAxis: {
				        min: 0,
				        max: 100,
				        lineWidth: 1,
				        tickPositions: []
				    },
				    plotOptions: {
				        solidgauge: {
				            borderWidth: '38px',
				            dataLabels: {
				                enabled: true,
				                backgroundColor: '#fcbdd1',
				                borderWidth:0,
				                // format: ' %',
				                format:'{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>'
				            },
				            linecap: 'round',
				            stickyTracking: false
				        }


				    },
				    lendged:{
				    },
				    series: [{
				        name: '达标比例',
				        borderColor: '#F62366',
				        data: [{
				            color: '#F62366',
				            radius: '100%',
				            innerRadius: '100%',
				            y: 48.90
				        }]
				    }]
				});
			 $('#container3_2').highcharts({
				        chart: {
				            zoomType: 'xy'
				        },
				        title: {
				            text: ''
				        },
				        subtitle: {
				            text: ''
				        },
				        xAxis: [{
				            categories: ['宋炜炜', '陈龙', '宋彩虹', '蔡守非', '马旺','舒欢','郭明','康赞'],
				            crosshair: true
				        }],
				        yAxis: [{ // Primary yAxis
				            labels: {
				                format: '{value}',
				                style: {
				                    color: Highcharts.getOptions().colors[1]
				                }
				            },
				            title: {
				                text: '提成',
				                style: {
				                    color: Highcharts.getOptions().colors[1]
				                }
				            }
				        }, { // Secondary yAxis
				            title: {
				                text: '销售额',
				                style: {
				                    color: Highcharts.getOptions().colors[0]
				                }
				            },
				            labels: {
				                format: '{value}万',
				                style: {
				                    color: Highcharts.getOptions().colors[0]
				                }
				            },
				            opposite: true
				        }],
				        tooltip: {
				            shared: true
				        },
				        legend: {
				        	enabled:false,
				            layout: 'vertical',
				            align: 'left',
				            x: 120,
				            verticalAlign: 'top',
				            y: 100,
				            floating: true,
				            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				        },
				        series: [{
				            name: '销售额',
				            type: 'column',
				            yAxis: 1,
				            data: [120,150,143,96.5,85.7,200,186,151],
				            tooltip: {
				                valueSuffix: '万'
				            }
				        }, {
				            name: '提成',
				            type: 'spline',
				            data: [0.1,0.17,0.15,0.14,0.13,0.26,0.15,0.13],
				            tooltip: {
				                valueSuffix: ''
				            }
				        }]
				});
			 //setTimeout(function() {
			 		$(".spinner-calm").hide();
				 	$("ion-scroll").show();
				 	$("p").show();
					$(".gzq_fenge").show();
					$(".tsb-ic-wrp").show();
			//	});
			 
		},100);
	});


})