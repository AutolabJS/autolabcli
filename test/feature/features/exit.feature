Feature: Exit
  I should logout of AutolabJS when I run exit command

  Scenario: Exit command when logged in
    Given I have already logged in
    When I run exit command
    Then My login credentials should be removed

  Scenario: Exit command when NOT logged in
    Given I am NOT logged in
    When I run exit command
    Then I should receive a warning message for invalid exit
