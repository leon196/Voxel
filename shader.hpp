#pragma once
#include "utils.hpp"

class Shader
{
    private:

        GLuint programID;

    public:

        Shader(std::string vert, std::string frag);
        ~Shader();

        void FreeProgram();
        bool Bind();
        void Unbind();
        GLuint GetProgramID();
        void PrintProgramLog( GLuint program );
        void PrintShaderLog( GLuint shader );

        GLuint LoadShader(std::string path, GLenum shaderType);
        bool LoadProgram(std::string vert, std::string frag);

        void SetUniformFloat(const char* name, float value);
};
