#pragma once
#include "utils.hpp"

class Drawer;
class Controller;

class Engine
{
    private:

        // Constructor & Destructor
        Engine();
        ~Engine();

        // Singleton
        Engine& operator= (const Engine&){}
        Engine (const Engine&){};
        static Engine m_instance;

        // SDL & OpenGL
        SDL_Window *window;
        SDL_Renderer *renderer;
        SDL_GLContext glContext;
        SDL_Event event;

        // Game Classes
        Drawer *drawer;
        Controller *controller;

        //
        float timeElapsed;
        float timeStarted;
        bool enable;

    public:

        // Singleton
        static Engine& Instance();

        // SDL & OpenGL
        int InitSDL(void);
        void InitOpenGLScene(void);
        void Quit(void);

        void GameLoop(void);
        void Events(void);
};
