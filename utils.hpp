#pragma once
#define GLEW_STATIC
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
#include <vector>
#include <iostream>
#include <fstream>
#include <windows.h>
#include <GL/glew.h>
#include <GL/gl.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <glm/glm.hpp>
#include "drawer.hpp"
#include "model.hpp"
#include "shader.hpp"
#include "controller.hpp"
#include "engine.hpp"

#define WINDOW_WIDTH 800
#define WINDOW_HEIGHT 600
#define FRAMES_PER_SECOND 60
#define FOV 45

using namespace std;

const GLdouble pi = 3.1415926535897932384626433832795;
const GLdouble pi2 = 6.283185307179586476925286766559;
const float TO_RADS = 3.1415926535897932384626433832795f / 180.0f;
float toRads(const float &theAngleInDegrees);

void perspectiveGL( GLdouble fovY, GLdouble aspect, GLdouble zNear, GLdouble zFar );
SDL_Cursor * cursorFromXPM(const char * xpm[]);
bool LoadOBJ(const char * path, std::vector < glm::vec3 > & out_vertices, std::vector < glm::vec2 > & out_uvs, std::vector < glm::vec3 > & out_normals);

class Utils {
    private:
    public:
        Utils();
        ~Utils();
};
