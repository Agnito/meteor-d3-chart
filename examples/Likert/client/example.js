Template.likert.rendered = function() {
  // Chart design based on my BulleT that was based on original bullet chart by Mike Bostock:
  // http://bl.ocks.org/mbostock/4061961
  // with d3.chart.js (0.1.2)
  // http://misoproject.com/d3-chart/
  d3.chart("LikertEven", {
    initialize: function() {
      var chart = this;
      this.xScale = d3.scale.linear();
      this.tickFormat( function(d){return Math.abs(d)} );
      this.x0 = chart.xScale(0);
      this.axisStyle(function(d) {
        return d.axisStyle;
      }); 
      this.base.classed("LikertEven", true);
      // Default configuration
      this._margin = { top: 0, right: 0, bottom: 0, left: 0 };
      this.duration(0);
      this.percent(function(d) {
        return d.percent;
      });
      this.width(100);
      this.height(40);
      this.reverse(false);
      this.orient("left");
      this.terjedelem(function(d) {
        return d.terjedelem;
      });
    /******************************************************************************/
      this.layer("rowBackgroundA", this.base.append("g").classed("rowBackgroundA", true), {
        dataBind: function(data) {
          data = data.rowStyle;
          return this.selectAll("rect").data(data);
        },
        insert: function() {
          return this.append("g");
        },
        events: {
          enter: function(d) {
            this.append("rect").attr("class", function(d){return d;})
                .attr("x", chart.xScale(-110))
                .attr("y", 0)
                .attr("height", chart.height())
                .attr("width", chart.xScale(250));
            this.append("rect").attr("class", function(d){  
              var axisStyle = chart.axisStyle();
              if( axisStyle === "axis" ){
                return "background " + d;
              }else{
                return "background " + "white";
              }
            })
                .attr("x", chart.xScale(100))
                .attr("y",  chart.height()/2)
                .attr("height", chart.height()/2)
                .attr("width", chart.xScale(40));
          }
        }
      }) 
    /******************************************************************************/
      this.layer("rowBackgroundB", this.base.append("g").classed("rowBackgroundB", true), {
        dataBind: function() {
          var format = this.chart().tickFormat();
          return this.selectAll("g.tickLine").data(this.chart().xScale.ticks(8), function(d) {
            return d;
          });
        },
        insert: function() {
          var tick = this.append("g").attr("class", "tickLine");
          var height =chart.height();
          var format = chart.tickFormat();
          tick.append("line")
            .attr("y1", 0)
            .attr("y2", chart.height())
            .attr("opacity", function(d) {
                if( d < 100 ){
                  return 1;
                }else{
                  return 0;
                }
              });
          return tick;
        },
        events: {
          enter: function(d) {  
            var axisStyle = chart.axisStyle();
            this.attr("transform", function(d) {
                return "translate(" + chart.xScale(d) + ",0)";
              })
              .attr("stroke-width", 1)  
              .attr("stroke", "#ffffff");
          },
          "exit:transition": function() {
            this.remove();
          }
        }
      })
    /******************************************************************************/
      this.layer("percent", this.base.append("g").classed("percent", true), {
        dataBind: function(data) {
          var data_percent = new Array();
          // @CodeXmonk: a bit of hack too - ToDo later.
          data_percent[0] = (data.percent[0]+data.percent[1])*(-1); // [-80,-45,20,40]
          data_percent[1] = data.percent[1]*(-1);
          data_percent[2] = data.percent[2]+data.percent[3];
          data_percent[3] = data.percent[2];
          return this.selectAll("rect.percent").data(data_percent);
        },
        insert: function() {
          return this.append("rect");
        },
        events: {
          enter: function(d, i) {
            this.attr("class", function(d, i) { return "percent s" + i; })
                .attr("height", chart.height())
                .attr("x", function(d,i) {
                  if( d < 0 ){
                    return chart.xScale(d);
                  }else{
                    return chart.xScale(0);
                  } 
                }) 
                .attr("width", function(d, i) {
                  return chart.xScale(Math.abs(d))-chart.xScale(0) ;
                })
                .attr("transform", "translate(" + 0 + ",0)" );
          },
          "merge:transition": function(d, i) {
            this.duration(chart.duration())
              .attr("x", function(d, i) {
                if( d < 0 ){
                  return chart.xScale(d);
                }else{
                  return chart.xScale(0);
                } 
              })
              .attr("width", function(d, i) {
                if( d < 0 ){
                  return chart.xScale(Math.abs(d))-chart.xScale(0) ;
                }else{
                    return chart.xScale(Math.abs(d))-chart.xScale(0) ;
                }
              })
              .attr("transform", "translate(" + 0 + ",0)" );
            },
          exit: function() {
            this.remove();
          }
        }
      });
    /******************************************************************************/
      this.layer("text", this.base.append("g").classed("text", true), {
        dataBind: function(data) {
          var data_percent = new Array();
          var dimension = data.dimension;
          var axisStyle = chart.axisStyle();
          // @CodeXmonk: a bit of hack too - ToDo later.
          data_percent[0] = new Array( (data.percent[0]+data.percent[1])*(-1), data.percent[0], dimension ); // [-80,-45,20,40]
          data_percent[1] = new Array( data.percent[1]*(-1), data.percent[1], dimension );
          data_percent[2] = new Array( data.percent[2]+data.percent[3], data.percent[3], dimension );
          data_percent[3] = new Array( data.percent[2], data.percent[2], dimension);
          return this.selectAll("text").data(data_percent);
        },
        insert: function() {
          return this.append("text")
        },
        events: {
          enter: function(d, i) {
            this.text( function(d,i) {
              var axisStyle = chart.axisStyle();
              if( axisStyle === "axis" ){
                return d[2][i+1];
              }else{
                switch (true)
                { 
                  case ( d[1] < 5 ):
                    return "";
                    break;
                  case ( 5 <= d[1] && d[1] < 8 ):
                    return Math.abs(d[1]);
                    break;
                  default:
                    return Math.abs(d[1])+"%";
                    break;
                }
              } 
            })
            .style("opacity", function() {
              var axisStyle = chart.axisStyle();
                if( axisStyle === "axis" ){
                  return 1;
                }else{
                  return 0;
                }
            })
            this.attr("class", function(d, i) {
              var axisStyle = chart.axisStyle();
                if( axisStyle === "axis" ){
                  return "textResultKiem";
                }else{
                  return "textResult";
                }
            })
            .attr("y", chart.height() - chart.height()/3)
            .attr("x", function(d, i) {
              return chart.xScale(d[0]); 
            })
            .attr("text-anchor", function(d, i) {
              if( d[0] < 0 ){
                return "start"; 
              }else{
                return "end";
              }
            })
            .attr("transform", function(d, i) {
              if( d[0] < 0 ){
                return "translate(" + 2 + ",0)";
              }else{
                return "translate(" + -2 + ",0)";
              }
            });
          },
          "merge:transition": function(d, i) {
            this.duration(chart.duration())
            .attr("x", function(d, i) {
              return chart.xScale(d[0]); 
            })
            .attr("text-anchor", function(d, i) {
              if( d[0] < 0 ){
                return "start"; 
              }else{
                return "end";
              }
            })
            .attr("transform", function(d, i) {
              if( d[0] < 0 ){
                return "translate(" + 2 + ",0)";
              }else{
                return "translate(" + -2 + ",0)";
              }
            });
            this.duration(chart.duration()*2)
              .style("opacity", function(d){return 1;});
          },
          exit: function() {
            this.remove();
          }
        }
      });
    /******************************************************************************/
      this.layer("textLegendA", this.base.append("g").classed("textLegendA", true), {
        dataBind: function(data) {
          var data_tmp = new Array();
          var dimension = data.dimension;
          var axisStyle = chart.axisStyle();
          data_tmp[0] = new Array( dimension );
          return this.selectAll("text").data(data_tmp);
        },
        insert: function() {
          return this.append("text");
        },
        events: {
          enter: function(d) {
            this.text( function(d) {return d[0][0];});
            this.attr("class", function() {
              var axisStyle = chart.axisStyle();
                if( axisStyle === "axis" ){
                  return "dimTextKiem";
                }else{
                  return "textLegendA";
                }
            })
            this.attr("y", function() {
              var axisStyle = chart.axisStyle();
                if( axisStyle === "axis" ){
                  return chart.height()/1.5;
                }else{
                  return chart.height()/2.8;
                }
            })
            .attr("x", function() { return chart.xScale(104);})
            .attr("text-anchor", function() {return "start"; });
          },
          "merge:transition": function() {
            this.attr("x", function() {
              return chart.xScale(104); 
            })
            .attr("text-anchor", function() {return "start"; });
          },
          exit: function() {
            this.remove();
          }
        }
      });
    /******************************************************************************/
      this.layer("textLegendB", this.base.append("g").classed("textLegendB", true), {
        dataBind: function(data) {
          var data_tmp = new Array();
          var axisStyle = chart.axisStyle();
          /* let's find the greatest value in data.percent array */
          var greatest;
          var indexOfGreatest;
          var array = data.percent;
          for (var i = 0; i < array.length; i++) {
            if (!greatest || array[i] > greatest) {
              greatest = array[i];
              indexOfGreatest = i;
            }
          }
          data_tmp[0] = new Array( data.percent[indexOfGreatest], indexOfGreatest, data.dimension );
          return this.selectAll("text").data(data_tmp);
        },
        insert: function() {
          return this.append("text");
        },
        events: {
          enter: function(d) {
            this.text( function(d) {
              var idx = d[1];
              var axisStyle = chart.axisStyle();
                if( axisStyle === "axis" ){
                  return "";
                }else{
                  return d[0] + "% " + d[2][idx+1];
                }
            });
            this.attr("class", function(d) {
              var idx = d[1];
              return "subtitle s" + idx;
            })
            this.attr("y", function() {
              var axisStyle = chart.axisStyle();
                if( axisStyle === "axis" ){
                  return chart.height()/1.5;
                }else{
                  return chart.height()-4;
                }
            })
            .attr("x", function() { return chart.xScale(104);})
            .attr("text-anchor", function() {return "start"; });
          },
          "merge:transition": function() {
            this.attr("x", function() {
              return chart.xScale(104); 
            })
            .attr("text-anchor", function() {return "start"; });
          },
          exit: function() {
            this.selectAll("text").remove();
          }
        }
      });
    /******************************************************************************/
      this.layer("ticks", this.base.append("g").classed("ticks", true), {
        dataBind: function() {
          var format = this.chart().tickFormat();
          return this.selectAll("g.tick").data(this.chart().xScale.ticks(8), function(d) {
            return d;
          });
        },
        insert: function() {
          var tick = this.append("g").attr("class", "tick");
          var height =chart.height();
          var format = chart.tickFormat();
          tick.append("line")
            .attr("y1", chart.height())
            .attr("y2", chart.height() * 7 / 6);
          tick.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .attr("y", chart.height() * 7 / 6)
            .text(format);
          return tick;
        },
        events: {
          enter: function(d) {  
            var axisStyle = chart.axisStyle();
            this.attr("transform", function(d) {
              return "translate(" + chart.xScale(d) + ",0)";
            })
            .style("opacity", function(d){
              if( axisStyle === "axis" ){
                return 1;
              }else{
                return 0;
              }
            });
          },
          "merge:transition": function(d) { 
          var axisStyle = chart.axisStyle();
            this.duration(chart.duration())
            .attr("transform", function(d) {
              return "translate(" + chart.xScale(d) + ",0)";
            })
            .style("opacity", function(d){
              if( axisStyle === "axis" ){
                return 1;
              }else{
                return 0;
              }
            });
            this.select("line")
              .attr("y1", chart.height())
              .attr("y2", chart.height() * 7 / 6);
            this.select("text")
              .attr("y", chart.height() * 7 / 6);
          },
          "exit:transition": function() {
            this.duration(chart.duration())
              .attr("transform", function(d) {
                return "translate(" + chart.xScale(d) + ",0)";
              })
              .style("opacity", 1e-6)
              .remove();
          }
        }
      });
      
      d3.timer.flush();
    },                                                                     

    transform: function(data) {
      var height = this.height();
      // misoproject: Copy data before sorting
      var newData = {
        rowStyle: data.rowStyle,
        dimension: data.dimension,
        randomizer: data.randomizer,
        terjedelem: data.terjedelem.slice(),
        percent: data.percent, 
        item: data.item,
      };
      this.xScale.domain([newData.terjedelem[0], newData.terjedelem[1]]);
      var axisStyle = this.axisStyle();
      if( axisStyle !== "axis" ){
        var select_tmp = d3.selectAll("[name=SVG]");
        select_tmp.attr("height",25);
      }
      return newData;
    },

    // misoproject: reverse or not
    reverse: function(x) {
      if (!arguments.length) return this._reverse;
      this._reverse = x;
      return this;
    },

    // misoproject: left, right, top, bottom
    orient: function(x) {
      if (!arguments.length) return this._orient;
      this._orient = x;
      this._reverse = this._orient == "right" || this._orient == "bottom";
      return this;
    },
    
    axisStyle: function(x) {
      if (!arguments.length) return this._axisStyle;
      this._axisStyle = x;
      return this;
    }, 

    // @CodeXmonk: terjedelem (20,80)
    terjedelem: function(x) {
      if (!arguments.length) return this._terjedelem;
      this._terjedelem = x;
      return this;
    },
    
    percent: function(x) {
      if (!arguments.length) return this._percent;
      this._percent = x;
      return this;
    },
    
    width: function(x) {
      var margin, width_tmp;
      if (!arguments.length) {
        return this._width;
      }
      margin = this.margin(); 
      width_tmp = x[0];
      width_tmp = width_tmp - (margin.left + margin.right);
      this._width = width_tmp; 
      this.xScale.range(this._reverse ? [width_tmp, 0] : [0, width_tmp]);
      this.base.attr("width", width_tmp);
      return this;
    },
    
    height: function(x) {
      var margin, height_tmp;
      if (!arguments.length) {
        return this._height;
      }
      margin = this.margin();
      height_tmp = x[0]; 
      height_tmp = height_tmp - (margin.top + margin.bottom)-10;
      this._height = height_tmp;
      this.base.attr("height", height_tmp);
      return this;
    },
    
    margin: function(margin) {
      if (!margin) {
        return this._margin;
      }
      var margin_tmp = margin;
      ["top", "right", "bottom", "left"].forEach(function(dimension) {
        if (dimension in margin_tmp) {
          this._margin[dimension] = margin_tmp[dimension];
        }
      }, this);
      this.base.attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
      return this;
    },

    tickFormat: function(x) {
      if (!arguments.length) return this._tickFormat;
      this._tickFormat = x;
      return this;
    },  

    orientation: function(x) {
      if (!arguments.length) return this._orientation;
      this._orientation = x;
      return this;
    },

    duration: function(x) {
      if (!arguments.length) return this._duration;
      this._duration = x;
      return this;
    }
  });

  // Chart design for T scores based on original bullet chart by Mike Bostock:
  // http://bl.ocks.org/mbostock/4061961
  // with d3.chart.js (0.1.2)
  // http://misoproject.com/d3-chart/
  d3.chart("LikertEvens", {
    initialize: function(options) {
      var mixins = this.mixins = [];
      var idx, len, mixin;
      var last = false;
      
      if (options && options.seriesCount) {
        for (idx = 0, len = options.seriesCount; idx < len; ++idx) {
          if( idx == len-1 ){
            this._addSeries(idx,true);
          }else{
            this._addSeries(idx,false);
          }
        }
      }
    },
    _addSeries: function(idx,last) {
      var mixin = this.mixin("LikertEven", this.base.append("svg")
        .attr("name", function(){
          if( last ){
            return "BaseSVG"
          }else{
            return "SVG"
          }
        })//"SVG")
        .append("g"));
        //.append("g")
        //.attr("id","row"+idx)
        //.attr("class","dark")
      // misoproject:
      // Cache the prototype's implementation of `transform` so that it may
      // be invoked from the overriding implementation. This is admittedly a
      // bit of a hack, and it may point to a future improvement for d3.chart
      var t = mixin.transform;

      mixin.transform = function(data) {
        return t.call(mixin, data[idx]);
      };

      this.mixins.push(mixin);
    },
    width: function(width) {
      var width, width_tmp;
      if (!arguments.length) {
        return this._width;
      }
      if (width.length == 1){ /* @CodeXmonk: now its horizontal */
        width_tmp = width[0];
      }else{ /* @CodeXmonk: a little more space needed for titles when it's vertical */
        width_tmp = width[0]+10;
      }
      this._width = width_tmp; 
      this.base.attr("width", width_tmp);
      var row = this.base.selectAll("svg").attr("width", width_tmp);
      //row.append("g").attr("width", width_tmp);
      this.mixins.forEach(function(mixin) {
        mixin.width(width);
      });
      return this;
    },
    height: function(height) {
      var height,height_tmp;
      height_tmp = height[0] + height[0]/2
      if (!arguments.length) {
        return this._height;
      }
      this._height = height[0]; 
      this.base.selectAll("svg").attr("height", height[0] );
      this.mixins.forEach(function(mixin) {
        mixin.height(height);
      });
      return this;
    },
    duration: function(duration) {
      if (!arguments.length) {
        return this._duration;
      }
      this._duration = duration;
      this.mixins.forEach(function(mixin) {
        mixin.duration(duration);
      });
    },
    margin: function(margin) {
      this.mixins.forEach(function(mixin) {
        mixin.margin(margin);
      });
      return this;
    } ,
    axisStyle: function(axisStyle) {
      /*this.mixins.forEach(function(mixin) {
        mixin.axisStyle(axisStyle);
      });*/
      var length = this.mixins.length,
      element = null;
      for (var i = 0; i < length; i++) {
        // Do something with element i.
          mixin = this.mixins[i];
        if( i==length-1 ){
          mixin.axisStyle(axisStyle);
        }else{
          mixin.axisStyle("noaxis");
        }
      }
      return this;
    }
  });

  function Data(){
    this.original =   [ 
      {"item":"a","percent":[4,5,7,8],"rowStyle":"d","terjedelem":[-100,100],"dimension":[
        "just for test",
        "of people never do anykind of test",
        "of people rarely test anything",
        "of people frequently test something",
        "of people are always testing"
      ]},
      {"item":"b","percent":[7,8,35,50],"rowStyle":"l","terjedelem":[-100,100],"dimension":[
        "I'd recommend this program to a friend.",
        "hate it",
        "have forgot it",
        "probably won't forget",
        "definitely do"
      ]},
      {"item":"c","percent":[10,15,30,45],"rowStyle":"d","terjedelem":[-100,100],"dimension":[
        "I learned a lot in this program.",
        "slept like a log","learnt nothing new",
        "become better people",
        "take a new lease on life"
      ]},
      {"item":"d","percent":[20,25,25,30],"rowStyle":"l","terjedelem":[-100,100],"dimension":[
        "This program exceeded my expectations.",
        "wish they have never fallen into line",
        "didn't find anything new","were surprised",
        "want to make it again"
      ]},
      {"item":"e","percent":[50,50,50,50],"rowStyle":"d","terjedelem":[-100,100],"dimension":[
        "Likert choices (4-point)",
        "Strongly disagree",
        "Disagree",
        "Strongly agree",
        "Agree"
      ]}
    ]
  }

  function TransformData(){
  }

  var getData = new Data();
  var data = getData.original;

  function LikertEven() {
    var myLikertEven = d3.select("#LikertEven").chart("LikertEvens", {
      seriesCount: data.length
    });
    myLikertEven.margin({ top: 0, right: 240, bottom: 5, left: 10 })
      .width([600])                        
      .height([40])
      .axisStyle("axis")
      .duration(1000);
    myLikertEven.draw(data);
    
    d3.selectAll("button#Randomize").on("click", function() { 
      d3.selectAll(".textResult").remove();
      d3.selectAll(".textResultKiem").remove(); 
      d3.selectAll(".subtitle").remove();
      var length = data.length,
      row = null;
      for (var i = 0; i < length-1; i++) {
        row = data[i];
        randomizeLikert(row.percent);
      }
      myLikertEven.draw(data);
    });
    
    d3.selectAll("button#Reset").on("click", function() { 
      d3.selectAll(".textResult").remove();
      d3.selectAll(".textResultKiem").remove(); 
      d3.selectAll(".subtitle").remove();
      getData = new Data();
      data = getData.original;
      myLikertEven.draw(data);
    });
  }

  function randomizeLikert(d) {
    var total = 100, sum;
    if (!d.randomizer) d.randomizer = randomizer(d);
    d[0] = d.randomizer(d[0],0,total);
    d[1] = d.randomizer(d[1],0,total);
    d[2] = d.randomizer(d[2],0,total);
    d[3] = d.randomizer(d[3],0,total);
    sum = d[0] + d[1] + d[2] + d[3];
    d[0] = Math.floor((d[0]/sum)*total);
    d[1] = Math.floor((d[1]/sum)*total);
    d[2] = Math.floor((d[2]/sum)*total);
    d[3] = Math.floor((d[3]/sum)*total);
    d[3] = d[3] + ( total - d[0] - d[1] - d[2] - d[3]);
    return d;
  }

  function getRandomInt(min, max) {
    return Math.ceil(Math.random() * (max - min + 1)) + min;
  }

  function randomizer(d,min,max) {
    return function(d,min,max) {
      return getRandomInt(min,max);
    };
  }
  
  LikertEven();
}