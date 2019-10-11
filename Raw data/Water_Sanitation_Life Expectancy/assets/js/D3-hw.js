function makeResponsive() {
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgHeight = 600;
  var svgWidth = 950;

  var margin = {
    top: 15,
    right: 40,
    bottom: 120,
    left: 100
  };

  var width = svgWidth - margin.right - margin.left;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "obesity";

  // function used for updating x-scale var upon click on axis label
  function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);

    return xLinearScale;
  }
  // function used for updating y-scale var upon click on yaxis label
  function yScale(data, chosenYAxis) {
    //create scales
    var yLinearScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => d[chosenYAxis]) * 0.9,
        d3.max(data, d => d[chosenYAxis]) * 1.1
      ])
      .range([height, 0]);

    return yLinearScale;
  }

  // function used for updating xAxis var upon click on axis label
  function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis
      .transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // function used for updating yAxis var upon click on axis label
  function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis
      .transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }
  // function used for updating circles group with a transition to new circles

  function renderCircles(
    circlesGroup,
    xLinearScale,
    chosenXAxis,
    yLinearScale,
    chosenYAxis
  ) {
    circlesGroup
      .transition()
      .duration(1000)
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]));

    return circlesGroup;
  }
  // function used for updating the text inside circles with a transition to new circles

  function rendertext(
    textGroup,
    xLinearScale,
    chosenXAxis,
    yLinearScale,
    chosenYAxis
  ) {
    textGroup
      .transition()
      .duration(1000)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]));

    return textGroup;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    if (chosenXAxis === "poverty" && chosenYAxis === "healthcare") {
      var labelX = "Poverty: ";
      var labelY = "Healthcare: ";
    } else if (chosenXAxis === "age" && chosenYAxis === "healthcare") {
      var labelX = "Age: ";
      var labelY = "Healthcare: ";
    } else if (chosenXAxis === "poverty" && chosenYAxis === "obesity") {
      var labelX = "Poverty: ";
      var labelY = "Obesity: ";
    } else if (chosenXAxis === "age" && chosenYAxis === "obesity") {
      var labelX = "Age: ";
      var labelY = "Obesity: ";
    } else if (chosenXAxis === "poverty" && chosenYAxis === "smokes") {
      var labelX = "Poverty: ";
      var labelY = "Smokes: ";
    } else if (chosenXAxis === "age" && chosenYAxis === "smokes") {
      var labelX = "Age: ";
      var labelY = "Smokes: ";
    } else if (chosenXAxis === "income" && chosenYAxis === "healthcare") {
      var labelX = "Income: ";
      var labelY = "Healthcare: ";
    } else if (chosenXAxis === "income" && chosenYAxis === "obesity") {
      var labelX = "Income: ";
      var labelY = "Obesity: ";
    } else {
      var labelX = "Income: ";
      var labelY = "Smokes: ";
    }

    var toolTip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return `${
          d.state
        }<br>${labelX}${d[chosenXAxis]}${labelX === "Age: " ? "" : "%"}<br>${labelY}${d[chosenYAxis]}%`;
      });

    circlesGroup.call(toolTip);

    circlesGroup
      .on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below

  d3.csv("assets/data/data.csv")
    .then(function(statedata, err) {
      if (err) throw err;

      // parse data
      statedata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.age = +data.age;
      });

      // Create x scale function
      var xLinearScale = xScale(statedata, chosenXAxis);

      // Create y scale function
      var yLinearScale = yScale(statedata, chosenYAxis);

      // Create initial axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // append x axis
      var xAxis = chartGroup
        .append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      // append y axis
      var yAxis = chartGroup
        .append("g")
        .classed("y-axis", true)
        .call(leftAxis);

      // append initial circles
      var circlesGroup = chartGroup
        .selectAll("circle")
        .data(statedata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 14)
        .attr("class", "stateCircle");

      // append texts inside circles
      var textGroup = chartGroup
        .selectAll("div")
        .data(statedata)
        .enter()
        .append("text")
        .text(function(d) {
          return d.abbr;
        })
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", "0.3em")
        //.attr("dx","-0.7em")
        .attr("class", "stateText")
        //.attr("font-family", "sans-serif")
        .attr("font-weight", "500");
      //.attr("font-size", "14px");

      // Create group for  3 x-axis labels
      var xLabelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

      // Create group for  3 x-axis labels
      var yLabelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(-90, ${height / 2})`);

      var povertyLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 25)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

      var ageLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median))");

      var incomeLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 75)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

      var obesityLabel = yLabelsGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obese (%)");

      var smokesLabel = yLabelsGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 25)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

      var healthcareLabel = yLabelsGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

      // updateToolTip for the current circles
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // x axis labels event listener
      xLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // updates x scale for new data
          xLinearScale = xScale(statedata, chosenXAxis);
          // yLinearScale = yScale(statedata, chosenYAxis);

          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);
          // yAxis = renderYAxis(yLinearScale, yAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(
            circlesGroup,
            xLinearScale,
            chosenXAxis,
            yLinearScale,
            chosenYAxis
          );
          textGroup = rendertext(
            textGroup,
            xLinearScale,
            chosenXAxis,
            yLinearScale,
            chosenYAxis
          );
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel.classed("active", true).classed("inactive", false);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", false).classed("inactive", true);
          } else if (chosenXAxis === "age") {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            incomeLabel.classed("active", false).classed("inactive", true);
          } else {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", true).classed("inactive", false);
          }
        }
      });

      // y axis labels event listener
      yLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          // replaces chosenYAxis with value
          chosenYAxis = value;

          // console.log(chosenYAxis)

          // updates y scale for new data
          // xLinearScale = xScale(statedata, chosenXAxis);
          yLinearScale = yScale(statedata, chosenYAxis);

          // updates y axis with transition
          //xAxis = renderXAxis(xLinearScale, xAxis);
          yAxis = renderYAxis(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderCircles(
            circlesGroup,
            xLinearScale,
            chosenXAxis,
            yLinearScale,
            chosenYAxis
          );
          textGroup = rendertext(
            textGroup,
            xLinearScale,
            chosenXAxis,
            yLinearScale,
            chosenYAxis
          );
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenYAxis === "obesity") {
            obesityLabel.classed("active", true).classed("inactive", false);
            smokesLabel.classed("active", false).classed("inactive", true);
            healthcareLabel.classed("active", false).classed("inactive", true);
          } else if (chosenYAxis === "smokes") {
            obesityLabel.classed("active", false).classed("inactive", true);
            smokesLabel.classed("active", true).classed("inactive", false);
            healthcareLabel.classed("active", false).classed("inactive", true);
          } else {
            obesityLabel.classed("active", false).classed("inactive", true);
            smokesLabel.classed("active", false).classed("inactive", true);
            healthcareLabel.classed("active", true).classed("inactive", false);
          }
        }
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
