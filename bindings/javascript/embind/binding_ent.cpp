#include <emscripten/bind.h>
#include <string>

#include "dwg.h"
#include "dwg_api.h"
#include "binding.h"


using namespace emscripten;

emscripten::val dwg_entity_polyline_2d_get_numpoints_wrapper(Dwg_Object_Ptr obj_ptr) {
  Dwg_Object* obj = reinterpret_cast<Dwg_Object*>(obj_ptr);
  int error = 0;
  auto numpoints = dwg_object_polyline_2d_get_numpoints(obj, &error);

  emscripten::val result = emscripten::val::object();
  result.set("error", error);
  result.set("data", numpoints);
  return result;
}

emscripten::val dwg_entity_polyline_2d_get_points_wrapper(Dwg_Object_Ptr obj_ptr) {
  Dwg_Object* obj = reinterpret_cast<Dwg_Object*>(obj_ptr);
  int error = 0;
  auto numpoints = dwg_object_polyline_2d_get_numpoints(obj, &error);
  if (error != 0) {
    emscripten::val result = emscripten::val::object();
    result.set("success", false);
    result.set("message", std::string("Failed to get the number of points!"));
    result.set("data", numpoints);
    return result;
  }
  
  auto points = dwg_object_polyline_2d_get_points(obj, &error);
  if (error != 0) {
    emscripten::val result = emscripten::val::object();
    result.set("success", false);
    result.set("message", std::string("Failed to get points!"));
    result.set("data", points);
    return result;
  }

  emscripten::val result = emscripten::val::object();
  emscripten::val points_obj = emscripten::val::array();
  for (int index = 0; index < numpoints; ++index) {
    auto point = points[index];
    emscripten::val point_obj = point2d_to_js_object(&point);
    points_obj.call<void>("push", point_obj);
  }

  result.set("success", true);
  result.set("data", points_obj);
  free(points);
  return result;
}

EMSCRIPTEN_BINDINGS(libredwg_dwg_object_ref) {
  DEFINE_FUNC(dwg_entity_polyline_2d_get_numpoints);
  DEFINE_FUNC(dwg_entity_polyline_2d_get_points);
}