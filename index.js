var add = require('gl-vec2/add');
var scale = require('gl-vec2/scale');
var distance = require('gl-vec2/distance');

var interpolatePoint = function(p0, p1, p2, p3, t0, t1, t2, t3, t) {
  var a1, a2, a3, b1, b2, c;
  a1 = [];
  a2 = [];
  a3 = [];
  b1 = [];
  b2 = [];
  c = [];

  add(a1, scale([], p0, (t1 - t)/(t1 - t0)), scale([], p1, (t - t0)/(t1 - t0)));
  add(a2, scale([], p1, (t2 - t)/(t2 - t1)), scale([], p2, (t - t1)/(t2 - t1)));
  add(a3, scale([], p2, (t3 - t)/(t3 - t2)), scale([], p3, (t - t2)/(t3 - t2)));

  add(b1, scale([], a1, (t2 - t)/(t2 - t0)), scale([], a2, (t - t0)/(t2 - t0)));
  add(b2, scale([], a2, (t3 - t)/(t3 - t1)), scale([], a3, (t - t1)/(t3 - t1)));

  add(c, scale([], b1, (t2 - t)/(t2 - t1)), scale([], b2, (t - t1)/(t2 - t1)));

  return c;
};

var catmullSegmentAtTime = function(p0, p1, p2, p3, t, knot) {
  var t0, t1, t2, t3, segmentDist;
  var points = [];
  segmentDist = distance(p1, p2);

  t0 = 0;
  t1 = Math.pow(distance(p0, p1), knot);
  t2 = Math.pow(segmentDist, knot) + t1;
  t3 = Math.pow(distance(p2, p3), knot) + t2;

  return interpolatePoint(p0, p1, p2, p3, t0, t1, t2, t3, t);
};

var catmullRomSpline = function(controlPoints, options) {
  if (controlPoints.length < 4) {
    throw "Must have at least 4 control points to generate catmull rom spline";
  }

  var points = [];
  var p0, p1, p2, p3, offset;

  options = options || {};
  var knot = options.knot || 0.5;
  var samples = options.samples;
  var pointsPerSegment = samples/controlPoints.length;

  for(var i = pointsPerSegment; i < samples-pointsPerSegment; ++i){
    var pos = Math.floor(i/pointsPerSegment);
    var p0 = controlPoints[pos];
    var p1 = controlPoints[pos+1];
    var p2 = controlPoints[pos+2];
    var p3 = controlPoints[pos+3];
    var t  = i/pointsPerSegment - Math.floor(i/pointsPerSegment);
    points.push(catmullSegmentAtTime(p0, p1, p2, p3, t, knot));
  }

  return points;
};

module.exports = catmullRomSpline;
