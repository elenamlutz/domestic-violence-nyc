import * as d3 from 'd3'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 0, left: 100, right: 80, bottom: 0 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([2009, 2018])
  .range([0, width])

const radiusScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([0, 45])

const yPositionScale = d3
  .scaleBand()
  .domain(['Male', 'Female'])
  .padding(1)
  .range([height, 0])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Number of Cases: <span style='color:white'>" + d.cases + '</span>'
  })
svg.call(tip)

d3.csv(require('../data/domestic_cases.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'rape-circle')
    .attr('r', d => radiusScale(d.cases))
    .attr('cx', d => xPositionScale(d.year))
    .attr('cy', d => yPositionScale(d.victim))
    .attr('y', function(d) {
      return yPositionScale(d.victim)
    })
    .attr('fill', '#2a4c66')
    .attr('opacity', 0.3)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.format('d'))
    .ticks(10)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.y-axis path').remove()
  svg.selectAll('.x-axis path').remove()
  // svg.selectAll('.y-axis line').remove()
  svg.selectAll('.x-axis line').remove()
  svg.selectAll('.y-axis text').attr('dx', -40)
  svg.selectAll('.x-axis text').attr('dy', -40)

  svg
    .selectAll('.y-axis line')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.4)
    .attr('x2', width)
    .lower()
}
