#pragma once
#include "utils.hpp"

using namespace glm;

class Controller
{
    private:
        vec2 mousePosition;
        vec2 mousePositionLast;
        bool mouseClicLeft;

        vec3 cameraAngle;
        vec3 cameraPosition;
        vec3 cameraForward;
        vec3 cameraRight;
        vec3 cameraUp;

        float theta;
        float phi;
        float sensivity;
        float speedMove;

        char key[SDL_NUM_SCANCODES];

    public:
        Controller();
        ~Controller();

        void HandleEvents(SDL_Event &event);
        void FirstPersonCamera(void);
};
