#include "controller.hpp"

Controller::Controller()
{
    mousePosition.x = mousePosition.y = 0.0f;
    mousePositionLast.x = mousePosition.y = 0.0f;
    mouseClicLeft = false;

    cameraAngle.x = cameraAngle.y = cameraAngle.z = 0.0f;
    cameraPosition.x = cameraPosition.y = 0.0f;
    cameraPosition.z = 0.0f;
    cameraForward.x = cameraForward.y = cameraForward.z = 0.0f;
    cameraRight.x = cameraRight.y = cameraRight.z = 0.0f;
    cameraUp.x = cameraUp.y = cameraUp.z = 0.0f;

    theta = phi = 0.f;
    sensivity = 1.f;
    speedMove = 0.01f;

    for (int k = SDL_NUM_SCANCODES-1; k >= 0; --k) {
        key[k] = 0;
    }
}

Controller::~Controller()
{

}

void Controller::HandleEvents(SDL_Event &event)
{
    switch(event.type)
    {
        // Mouse Move
        case SDL_MOUSEMOTION :
            mousePosition.x = event.motion.xrel * sensivity;
            mousePosition.y = event.motion.yrel * sensivity;
            break;

        // Mouse Clic
        case SDL_MOUSEBUTTONDOWN :
            if( event.button.button == SDL_BUTTON_LEFT ) {
                mouseClicLeft = true;
            }
            break;

        // Key Pressed
        case SDL_KEYDOWN:
            key[event.key.keysym.sym] = 1;
            // Escape
            if (event.key.keysym.sym == SDLK_ESCAPE)
                Engine::Instance().Quit();
            break;

        // Key Released
        case SDL_KEYUP:
            key[event.key.keysym.sym] = 0;
            break;

        // Quit
        case SDL_WINDOWEVENT_CLOSE:
        case SDL_QUIT:
            Engine::Instance().Quit();
            break;

        default:
        break;
    }
}

void Controller::FirstPersonCamera(void)
{
    // Camera Orientation
    phi += mousePosition.y;
    theta += mousePosition.x;

    if (phi > 89)
        phi = 89;
    else if (phi < -89)
        phi = -89;

    cameraForward.x = cos(theta/180*pi + pi * 0.5f) * (1.f -abs(phi / 90.f));
    cameraForward.y = 0.f;
    cameraForward.z = sin(theta/180*pi + pi * 0.5f) * (1.f -abs(phi / 90.f));

    cameraRight = cross(cameraForward, vec3(0.f, 1.f, 0.f));

    // Camera Position

    if (key[SDLK_w]) {
        cameraPosition += cameraForward * speedMove;
    } else if (key[SDLK_s]) {
        cameraPosition -= cameraForward * speedMove;
    } if (key[SDLK_a]) {
        cameraPosition -= cameraRight * speedMove;
    } else if (key[SDLK_d]) {
        cameraPosition += cameraRight * speedMove;
    }if (key[SDLK_e]) {
        cameraPosition.y -= speedMove;
    } else if (key[SDLK_c]) {
        cameraPosition.y += speedMove;
    }


    glLoadIdentity();
    glRotatef(phi, 1.f, 0.f, 0.f);
    glRotatef(theta, 0.f, 1.f, 0.f);
    glTranslatef(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    mousePosition.x = 0.f;
    mousePosition.y = 0.f;
}
