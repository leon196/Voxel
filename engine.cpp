#include "engine.hpp"

// Singleton
Engine Engine::m_instance = Engine();
Engine& Engine::Instance()
{
    return m_instance;
}

// Constructor
Engine::Engine()
{
    InitSDL();
    InitOpenGLScene();

    drawer = new Drawer();
    controller = new Controller();

    timeElapsed = 0.f;
}

// Destructor
Engine::~Engine()
{
    delete drawer;
    delete controller;
}

// SDL & OpenGL
int Engine::InitSDL(void)
{
    // Window
    window = SDL_CreateWindow("Voxel", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, WINDOW_WIDTH, WINDOW_HEIGHT, SDL_WINDOW_SHOWN|SDL_WINDOW_OPENGL|SDL_RENDERER_ACCELERATED|SDL_RENDERER_PRESENTVSYNC);
    if(!window) {
        std::cout << "SDL Error : " << SDL_GetError() << std::endl;
        return -1;
    }

    // OpenGL Context
    glContext = SDL_GL_CreateContext(window);

    // Renderer
    renderer = SDL_CreateRenderer(window, -1, 0);
    if(!renderer) {
        std::cout << "SDL Error : " << SDL_GetError() << std::endl;
        return -1;
    }

    // Glew
    //glewExperimental = GL_TRUE;
    if (glewInit() != GLEW_OK) {
        fprintf(stderr, "Failed to initialize GLEW\n");
        return -1;
    }

    // For main loop
    enable = true;

    // Threads
    //threadEvents = SDL_CreateThread(Events, "Events",  NULL );
    //threadGameLoop = SDL_CreateThread( GameLoop, "Events", NULL );

    // Hide cursor
    //SDL_ShowCursor(0);

const char *hand1[] =
        {
            /* width height num_colors chars_per_pixel */
            " 16 16 3 1 ",
            /* colors */
            "X c #000000",
            ". c #ffffff",
            "  c None",
            /* pixels */
            "       XX       ",
            "    XXX..XXX    ",
            "   X..X..X..X   ",
            "   X..X..X..X X ",
            "   X..X..X..XX.X",
            "   X..X..X..X..X",
            " XX X.......X..X",
            "X..XX..........X",
            "X...X.........X ",
            " X............X ",
            "  X...........X ",
            "  X..........X  ",
            "   X.........X  ",
            "    X.......X   ",
            "     XX....XX   ",
            "       XXXX     ",
            "0,0"
        };

    SDL_SetRelativeMouseMode(SDL_TRUE);
    SDL_SetCursor(cursorFromXPM(hand1));

    // Timing
    timeElapsed = SDL_GetTicks();

    //int threadValue1;
    //SDL_WaitThread(threadEvents, &threadValue1);
    //SDL_WaitThread(threadGameLoop, &threadValue1);

    return 0;
}

void Engine::InitOpenGLScene(void)
{
    glShadeModel(GL_SMOOTH);                                    // Enables Smooth Shading
    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);                       // Black Background
    glClearDepth(1.0f);                                         // Depth Buffer Setup
    glEnable(GL_DEPTH_TEST);                                    // Enables Depth Testing
    glDepthFunc(GL_LEQUAL);                                     // The Type Of Depth Test To Do
    glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);          // Really Nice Perspective Calculations
    glBlendFunc( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA );
    glViewport(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    glMatrixMode(GL_PROJECTION);
    perspectiveGL(FOV,  WINDOW_WIDTH/WINDOW_HEIGHT,  0.01,  1000.0);
    glMatrixMode(GL_MODELVIEW);

}

void Engine::GameLoop(void)
{
    while (enable/* && SDL_WaitEvent(&event)*/) {

        //
        //while(SDL_WaitEvent(&event)) {
        if (SDL_PollEvent(&event)) {
            controller->HandleEvents(event);

            // Reset Mouse
            //SDL_WarpMouseInWindow(window, WINDOW_WIDTH/2.f, WINDOW_HEIGHT/2.f);
        }

        // Timing
        timeElapsed = SDL_GetTicks();

        // Control Camera
        controller->FirstPersonCamera();

        // Drawing
        drawer->Draw();

        // Render
        SDL_GL_SwapWindow(window);
        //}
        //If we want to cap the frame rate
        /*
        if( timeElapsed - timeStarted > FRAMES_PER_SECOND) {
            //Sleep the remaining frame time
            SDL_Delay( ( FRAMES_PER_SECOND ) );
            timeStarted = timeElapsed;
        }
        */
    }
}

void Engine::Quit()
{
    enable = false;
    SDL_GL_DeleteContext(glContext);
    SDL_DestroyWindow(window);
}
