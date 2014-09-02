#pragma once
#include "utils.hpp"

class Model
{
    private:

        // VAO
        GLuint VertexArrayID;
        GLuint vao;
        GLuint vertexbuffer;
        GLuint normalbuffer;
        std::vector< glm::vec3 > vertices;
        std::vector< glm::vec2 > uvs;
        std::vector< glm::vec3 > normals;
    public:

        Model();
        ~Model();

        Model(const char* file);

        void Draw();
};
