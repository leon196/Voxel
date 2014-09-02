#include "drawer.hpp"

Drawer::Drawer()
{
    SetupShaders();

    model = new Model("model/suzanne.obj");
}

Drawer::~Drawer()
{
    shader->Unbind();
    delete shader;
    delete model;
}

void Drawer::SetupShaders()
{
    // Create and compile our GLSL program from the shaders
    shader = new Shader("shader/simple.vert", "shader/simple.frag");
    shader->Bind();
}

void Drawer::Draw()
{
    // Update uniforms
    shader->SetUniformFloat("timeElapsed", SDL_GetTicks() * 0.001);

    // Clear The Screen And The Depth Buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    for (int i = 0; i < 16; i++) {

        vec3 position = vec3(cos(i/8.f*pi)*10.f, 0.f, sin(i/8.f*pi)*10.f);

        glBegin(GL_TRIANGLES);                          // Drawing Using Triangles
            glTexCoord2f (0.0f, 0.0f);
            glVertex3f( position.x, position.y + 1.0f, position.z);              // Top
            glTexCoord2f (1.0f, 1.0f);
            glVertex3f(position.x - 1.0f, position.y - 1.0f, position.z);              // Bottom Left
            glTexCoord2f (1.0f, 0.0f);
            glVertex3f( position.x + 1.0f, position.y - 1.0f, position.z);              // Bottom Right
        glEnd();
    }

    model->Draw();

}
