var margin ={top:20, right:30, bottom:30, left:40},
    width=960-margin.left - margin.right, 
    height=500-margin.top-margin.bottom;

// scale to ordinal because x axis is not numerical
var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

//scale to numerical value by height
var y = d3.scale.linear().range([height, 0]);

var chart = d3.select("#chart")  
              .append("svg")  //append svg element inside #chart
              .attr("width", width+(2*margin.left)+margin.right)    //set width
              .attr("height", height+margin.top+margin.bottom);  //set height
var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");  //orient bottom because x-axis will appear below the bars

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

//create tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Percentage of Word:</strong> <span style='color:yellow'>" + d.wordPercentage + "</span>,<br> <strong>Average Follower Count:</strong> <span style='color:yellow'>" + d.avgFollowerCount + "</span>";
  });

  chart.call(tip);

d3.json("lol.json", function(error, data){
  //bind x data to be location
  x.domain(data.map(function(d){ return d.location;}));
  //bind y data to be percentage of word in tweets
  y.domain([0, d3.max(data, function(d){return d.wordPercentage;})]);
  
  var bar = chart.selectAll("g")
                  .data(data)
                  .enter()
                  .append("g")
                  .attr("transform", function(d, i){
                    return "translate("+x(d.location)+", 0)";
                  });
  
  bar.append("rect")
     .attr("y", function(d) { 
       return y(d.wordPercentage); 
     })
     .attr("x", function(d,i){
       return x.rangeBand()+(margin.left/-.25);
     })
     .attr("height", function(d) { 
       return height - y(d.wordPercentage); 
     })
     .attr("width", x.rangeBand());  //set width base on range on ordinal data

  //append labels
  bar.append("text")
      .attr("x", x.rangeBand()+margin.left )
      .attr("y", function(d) { return y(d.wordPercentage) -10; })
      .attr("dy", ".71em");
  
  //append x axis
  chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+margin.left+","+ height+")")        
        .call(xAxis);
  
  //append y axis
  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+margin.left+",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percentage of Tweets Containing Given Word");

  //call tooltips on mouseover
	chart.selectAll("rect")
		   .on('mouseover', tip.show)
       .on('mouseout', tip.hide)
});



function type(d) {
    d.location = +d.location; // coerce to number
    return d;
  }
