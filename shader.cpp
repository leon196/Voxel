#include "shader.hpp"

Shader::Shader(std::string vert, std::string frag)
{
    programID = NULL;
    LoadProgram(vert, frag);
}

Shader::~Shader()
{
    FreeProgram();
}

void Shader::FreeProgram()
{
    glDeleteProgram( programID );
}

bool Shader::Bind() {
    //Use shader
    glUseProgram( programID );
    //Check for error
    GLenum error = glGetError();
    if( error != GL_NO_ERROR ) {
        printf( "Error binding shader! %s\n", gluErrorString( error ) );
        PrintProgramLog( programID );
        return false;
    }
    return true;
}

void Shader::Unbind()
{
    glUseProgram( NULL );
}

GLuint Shader::GetProgramID()
{
    return programID;
}

void Shader::SetUniformFloat(const char* name, float value)
{
    glUniform1f(glGetUniformLocation(programID, name), value);
}

void Shader::PrintProgramLog( GLuint program )
{
    //Make sure name is shader
    if( glIsProgram( program ) ) {
        //Program log length
        int infoLogLength = 0;
        int maxLength = infoLogLength;
        //Get info string length
        glGetProgramiv( program, GL_INFO_LOG_LENGTH, &maxLength );
        //Allocate string
        char* infoLog = new char[ maxLength ];
        //Get info log
        glGetProgramInfoLog( program, maxLength, &infoLogLength, infoLog );
        if( infoLogLength > 0 ) {
            //Print Log
            printf( "%s\n", infoLog );
        }
        //Deallocate string
        delete[] infoLog;
    } else {
        printf( "Name %d is not a program\n", program );
    }
}

void Shader::PrintShaderLog( GLuint shader )
{
    //Make sure name is shader
    if( glIsShader( shader ) ) {
        //Shader log length
        int infoLogLength = 0;
        int maxLength = infoLogLength;
        //Get info string length
        glGetShaderiv( shader, GL_INFO_LOG_LENGTH, &maxLength );
        //Allocate string
        char* infoLog = new char[ maxLength ];
        //Get info log
        glGetShaderInfoLog( shader, maxLength, &infoLogLength, infoLog );
        if( infoLogLength > 0 ) {
            //Print Log
            printf( "%s\n", infoLog );
        }
        //Deallocate string
        delete[] infoLog;
    } else {
        printf( "Name %d is not a shader\n", shader );
    }
}

GLuint Shader::LoadShader( std::string path, GLenum shaderType ) {
    //Open file
    GLuint shaderID = 0;
    std::string shaderString;
    std::ifstream sourceFile( path.c_str() );
    //Source file loaded
    if( sourceFile ) {
        //Get shader source
        shaderString.assign( ( std::istreambuf_iterator< char >( sourceFile ) ), std::istreambuf_iterator< char >() );
        //Create shader ID
        shaderID = glCreateShader( shaderType );
        //Set shader source
        const GLchar* shaderSource = shaderString.c_str();
        glShaderSource( shaderID, 1, (const GLchar**)&shaderSource, NULL );
        //Compile shader source
        glCompileShader( shaderID );
        //Check shader for errors
        GLint shaderCompiled = GL_FALSE;
        glGetShaderiv( shaderID, GL_COMPILE_STATUS, &shaderCompiled );
        if( shaderCompiled != GL_TRUE ) {
            printf( "Unable to compile shader %d!\n\nSource:\n%s\n", shaderID, shaderSource );
            PrintShaderLog( shaderID );
            glDeleteShader( shaderID );
            shaderID = 0;
        }
    } else {
        printf( "Unable to open file %s\n", path.c_str() );
    }
    return shaderID;
}

bool Shader::LoadProgram(std::string vert, std::string frag)
{
    //Generate program
    programID = glCreateProgram();
    //Load vertex shader
    GLuint vertexShader = LoadShader( vert , GL_VERTEX_SHADER );
    //Check for errors
    if( vertexShader == 0 ) {
        glDeleteProgram( programID );
        programID = 0;
        return false;
    }
    //Attach vertex shader to program
    glAttachShader( programID, vertexShader );
    //Create fragment shader
    GLuint fragmentShader = LoadShader( frag, GL_FRAGMENT_SHADER );
    //Check for errors
    if( fragmentShader == 0 ) {
        glDeleteProgram( programID );
        programID = 0;
        return false;
    }
    //Attach fragment shader to program
    glAttachShader( programID, fragmentShader );
    //Link program
    glLinkProgram( programID );
    //Check for errors
    GLint programSuccess = GL_TRUE;
    glGetProgramiv( programID, GL_LINK_STATUS, &programSuccess );
    if( programSuccess != GL_TRUE ) {
        printf( "Error linking program %d!\n", programID );
        PrintProgramLog( programID );
        glDeleteProgram( programID );
        programID = 0;
        return false;
    }
    return true;
}
